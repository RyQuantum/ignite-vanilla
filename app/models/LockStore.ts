import { Alert } from "react-native"
import { getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { LockModel } from "./Lock"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { LockControlType, Ttlock } from "react-native-ttlock"
import Toast from "react-native-simple-toast"
import { stringMd5 } from "react-native-quick-md5"

export const LockStoreModel = types
  .model("LockStore")
  .props({
    isLoading: false,
    isRefreshing: false,
    locks: types.array(LockModel),
  })
  .views((store) => ({
    get lockList() {
      return store.locks.slice()
    },
    get lockGroups() {
      const locks = store.locks.slice()
      const result = new Map()
      locks.forEach((lock) => {
        if (!result.get(lock.groupId))
          result.set(lock.groupId, { groupName: lock.groupName, locks: [lock] })
        else result.get(lock.groupId).locks.push(lock)
      })
      return result
    },
    getLockInfo(lockId: number) {
      return store.locks.find(l => l.lockId === lockId)
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    async getKeyList(): Promise<object[]> {
      store.isRefreshing = true
      const res: any = await api.getKeyList() // TODO add pagination
      store.setProp("isRefreshing", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.list) {
            store.setProp("locks", res.data.list)
            // return res.data.list
          } else {
            alert(JSON.stringify(res))
          }
          break
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return []
    },

    async initialize(
      lockData: string,
      name: string,
    ): Promise<{ lockId: number; keyId: number } | null> {
      store.isLoading = true
      const res: any = await api.initialize(lockData, name)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async rename(lockId: number, lockAlias: string) {
      store.isLoading = true
      const res: any = await api.rename(lockId, lockAlias)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async unlockOperation(lockId: number) {
      store.isLoading = true
      const lock = store.locks.find(l => l.lockId === lockId)
      return new Promise((resolve) => {
        Ttlock.controlLock(LockControlType.Unlock, lock.lockData, () => {
          console.log("TTLock: unlock success")
          store.setProp("isLoading", false)
          setTimeout(() => Toast.showWithGravity("Unlocked", Toast.SHORT, Toast.CENTER), 200)
          return resolve(null)
        }, (errorCode, errorDesc) => { // TODO print error in the log
          store.setProp("isLoading", false)
          Alert.alert(`Code: ${errorCode}`, `${errorDesc}`)
          return resolve(null)
        })
      })
    },

    async lockOperation(lockId: number) {
      store.isLoading = true
      const lock = store.locks.find(l => l.lockId === lockId)
      return new Promise((resolve) => {
        Ttlock.controlLock(LockControlType.Lock, lock.lockData, () => {
          console.log("TTLock: lock success")
          store.setProp("isLoading", false)
          setTimeout(() => Toast.showWithGravity("Locked", Toast.SHORT, Toast.CENTER), 200)
          return resolve(null)
        }, (errorCode, errorDesc) => { // TODO print error in the log
          store.setProp("isLoading", false)
          Alert.alert(`Code: ${errorCode}`, `${errorDesc}`)
          return resolve(null)
        })
      })
    },

    async verifyPassword(password: string) {
      store.isLoading = true
      const username = getRoot(store).authenticationStore.authEmail
      const res: any = await api.login(username, stringMd5(password))
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async deleteLock(keyId: number) {
      store.isLoading = true
      const lock = store.locks.find((l) => l.keyId === keyId)
      return new Promise((resolve) => {
        Ttlock.resetLock(lock.lockData, async () => {
          console.log("TTLock: resetLock success")
          const res: any = await api.deleteLock(lock.keyId)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              setTimeout(() => Toast.showWithGravity("Deleted", Toast.SHORT, Toast.CENTER), 200)
              store.setProp("locks", store.locks.filter((l) => l.keyId !== lock.keyId))
              return resolve(res.data)
            case "bad":
              Alert.alert(`code: ${res.code}`, res.msg)
              break
            default:
              Alert.alert(res.kind, res.msg)
          }
          return resolve(null)
        }, (errorCode, errorDesc) => {
          store.setProp("isLoading", false)
          Alert.alert(`Code: ${errorCode}`, `${errorDesc}`)
          return resolve(null)
        })
      })
    }
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { isLoading, isRefreshing, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface LockStore extends Instance<typeof LockStoreModel> {}
export interface LockStoreSnapshot extends SnapshotOut<typeof LockStoreModel> {}

// @demo remove-file
