import { Alert } from "react-native"
import { getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { CodeModel } from "./Code"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Ttlock } from "react-native-ttlock"
import Toast from 'react-native-simple-toast';

export const CodeStoreModel = types
  .model("CodeStore")
  .props({
    isRefreshing: false,
    isLoading: false,
    codes: types.array(CodeModel),
  })
  .views((store) => ({
    // get codeList() {
    //   return store.codes.slice()
    // },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({

    updateCodeValue(codeId: number, keyboardPwd: string) {
      const codes = store.codes.slice()
      const code = codes.find((c) => c.keyboardPwdId === codeId)
      code.keyboardPwd = keyboardPwd
      store.setProp("codes", codes)
    },

    async getCodeList(lockId: number): Promise<object[]> {
      store.isRefreshing = true
      const res: any = await api.getCodeList(lockId) // TODO add pagination
      store.setProp("isRefreshing", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.list) {
            store.setProp("codes", res.data.list)
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

    async generateCode(lockId: number, keyboardPwdType: number, keyboardPwdName: string, startDate: number, endDate?: number) {
      store.isLoading = true
      const res: any = await api.generateCode(lockId, keyboardPwdType, keyboardPwdName, startDate, endDate)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok": // TODO get newest codeList if wanted
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async addCode(lockId: number, keyboardPwd: string, keyboardPwdName: string, startDate: number, endDate: number, addType = 1) { // TODO addType can be 2 for gateway
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === lockId)
      return new Promise((resolve) => {
        Ttlock.createCustomPasscode(keyboardPwd, startDate, endDate, lock.lockData, async () => {
          console.log("TTLock: addCode success")
          const res: any = await api.addCode(lockId, keyboardPwd, keyboardPwdName, startDate, endDate, addType) // deleteType by default is 1, TODO gateway is 2
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              return resolve(res.data)
            case "bad":
              Alert.alert(`code: ${res.code}`, res.msg)
              break
            default:
              Alert.alert(res.kind, res.msg)
          }
          return resolve(null)
        }, (errorCode, errorDesc) => { // TODO print error in the log
          store.setProp("isLoading", false)
          Alert.alert(`Code: ${errorCode}`, `${errorDesc}`)
          return resolve(null)
        })
      })
    },

    async updateCode(keyboardPwdId: number, newkeyboardPwd: string, keyboardPwdName: string, startDate: number, endDate: number, changeType = 1) { // TODO changeType can be 2 for gateway
      store.isLoading = true
      const code = store.codes.find((c) => c.keyboardPwdId === keyboardPwdId)
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === code.lockId)
      return new Promise((resolve) => {
        Ttlock.modifyPasscode(code.keyboardPwd, newkeyboardPwd, startDate, endDate, lock.lockData, async () => {
          console.log("TTLock: modify passcode success")
          const res: any = await api.updateCode(code.lockId, keyboardPwdId, keyboardPwdName, newkeyboardPwd, startDate, endDate, changeType)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
              store.updateCodeValue(code.keyboardPwdId, newkeyboardPwd)
              // store.setProp("codes", store.codes.filter((c) => c.keyboardPwdId !== keyboardPwdId))
              return resolve(res.data)
            case "bad":
              Alert.alert(`code: ${res.code}`, res.msg)
              break
            default:
              Alert.alert(res.kind, res.msg)
          }
          return resolve(null)
        }, (errorCode, errorDesc) => { // TODO print error in the log
          store.setProp("isLoading", false)
          Alert.alert(`Code: ${errorCode}`, `${errorDesc}`)
          return resolve(null)
        })
      })
    },

    async deleteCode(lockId: number, keyboardPwdId: number, deleteType?: number) { // TODO make TTLock library promisable
      store.isLoading = true
      const code = store.codes.find((c) => c.keyboardPwdId === keyboardPwdId)
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === lockId)
      return new Promise((resolve) => {
        Ttlock.deletePasscode(code.keyboardPwd, lock.lockData, async () => {
          console.log("TTLock: deleteCode success")
          const res: any = await api.deleteCode(lockId, keyboardPwdId, deleteType || 1) // deleteType by default is 1, TODO gateway is 2
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              setTimeout(() => Toast.showWithGravity("Deleted", Toast.SHORT, Toast.CENTER), 200)
              store.setProp("codes", store.codes.filter((c) => c.keyboardPwdId !== keyboardPwdId))
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
    },
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { isLoading, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface CodeStore extends Instance<typeof CodeStoreModel> {}
export interface CodeStoreSnapshot extends SnapshotOut<typeof CodeStoreModel> {}

// @demo remove-file
