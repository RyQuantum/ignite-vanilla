import { Alert } from "react-native"
import { getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { LockModel } from "./Lock"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { LockControlType, Ttlock } from "react-native-ttlock"
import Toast from "react-native-simple-toast"

export const LockStoreModel = types
  .model("LockStore")
  .props({
    isLoading: false,
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
      store.isLoading = true
      const res: any = await api.getKeyList() // TODO add pagination
      store.setProp("isLoading", false)
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
    }
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface LockStore extends Instance<typeof LockStoreModel> {}
export interface LockStoreSnapshot extends SnapshotOut<typeof LockStoreModel> {}

// @demo remove-file
