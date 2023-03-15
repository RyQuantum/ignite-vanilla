import { Alert } from "react-native"
import { applySnapshot, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { CodeModel } from "./Code"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Ttlock } from "react-native-ttlock"
import Toast from 'react-native-simple-toast';
import Share from "react-native-share"

export const CodeStoreModel = types
  .model("CodeStore")
  .props({
    isRefreshing: false,
    isLoading: false,
    lockId: 0,
    codeId: 0,
    codes: types.array(CodeModel),
  })
  .views((store) => ({
    get codeList() {
      return store.codes.slice()
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({

    updateLockId(id: number) {
      store.lockId = id
    },

    updateCodeId(id: number) {
      store.codeId = id
    },

    updateCodeToStore(codeId: number, keyboardPwd: string) {
      const codes = store.codes.slice()
      const code = codes.find((c) => c.keyboardPwdId === codeId)
      code.keyboardPwd = keyboardPwd
      store.setProp("codes", codes)
    },

    updateCodeNameToStore(codeId: number, keyboardPwdName: string) {
      const codes = store.codes.slice()
      const code = codes.find((c) => c.keyboardPwdId === codeId)
      code.keyboardPwdName = keyboardPwdName
      store.setProp("codes", codes)
    },

    updateCodePeriodToStore(codeId: number, startDate: number, endDate: number) {
      const codes = store.codes.slice()
      const code = codes.find((c) => c.keyboardPwdId === codeId)
      code.startDate = startDate
      code.endDate = endDate
      store.setProp("codes", codes)
    },

    reset() {
      applySnapshot(store, {})
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
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === code!.lockId)
      return new Promise((resolve) => {
        Ttlock.modifyPasscode(code.keyboardPwd, newkeyboardPwd, startDate, endDate, lock.lockData, async () => {
          console.log("TTLock: modify passcode success")
          const res: any = await api.updateCode(code.lockId, keyboardPwdId, keyboardPwdName, newkeyboardPwd, startDate, endDate, changeType)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
              store.updateCodeToStore(code.keyboardPwdId, newkeyboardPwd)
              if (startDate) store.updateCodePeriodToStore(code.keyboardPwdId, startDate, endDate)
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

    async updateCodeName(keyboardPwdId: number, keyboardPwdName: string) {
      store.isLoading = true
      const code = store.codes.find((c) => c.keyboardPwdId === keyboardPwdId)
      // const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === code.lockId)
      const res: any = await api.updateCode(code!.lockId, keyboardPwdId, keyboardPwdName)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
          store.updateCodeNameToStore(keyboardPwdId, keyboardPwdName)
          // store.setProp("codes", store.codes.filter((c) => c.keyboardPwdId !== keyboardPwdId))
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
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

    async resetAllCodes(lockId: number) {
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === lockId)
      return new Promise((resolve) => {
        Ttlock.resetPasscode(lock.lockData, async (newLockData) => {
          console.log("TTLock: reset passcodes success")
          const res: any = await api.updateLock(lockId, newLockData)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.reset()
              setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
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

    async share() {
      const code = store.codes.find(c => c.keyboardPwdId === store.codeId)
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      let type = ""
      const startDate = new Date(code.startDate)
      const endDate = new Date(code.endDate)
      let startString = `${startDate.toLocaleDateString("en-CA")} ${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
      const beforeDate = new Date(code.startDate)
      let beforeString = ""
      switch (code.keyboardPwdType) {
        case 2:
          type = "Permanent"
          beforeDate.setDate(beforeDate.getDate() + 1)
          beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
          break
        case 3:
          type = "Timed"
          startString = `${startDate.toLocaleDateString("en-CA")} ${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"} End time: ${endDate.toLocaleDateString("en-CA")} ${endDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"}`
          if (!code.isCustom) {
            beforeDate.setDate(beforeDate.getDate() + 1)
            beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
          }
          break
        case 1:
          type = "One-time"
          beforeDate.setHours(beforeDate.getHours() + 6)
          beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
          break
        // case 3:
        //   if (this.state.isPermanent) {
        //     type = "Permanent"
        //     startDate = new Date(0)
        //     startString = `${startDate.toLocaleDateString("en-CA")} ${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
        //   } else {
        //     type = "Timed"
        //     startString = `${this.state.startDate} ${this.state.startTime} End time: ${this.state.endDate} ${this.state.endTime}`
        //   }
        //   break
        case 4:
          type = "Erase"
          beforeDate.setDate(beforeDate.getDate() + 1)
          beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
          break
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
          type = data.find(item => item.key === code.keyboardPwdType).label + " Recurring"
          startString = `${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"} End time: ${endDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"}`
          beforeDate.setDate(beforeDate.getDate() + 1)
          beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
          break
        default:
          type = `invalid keyboardPwdType: ${code.keyboardPwdType}`
      }

      const message = `Hello, Here is your Pin Code: ${code.keyboardPwd}\nStart time: ${startString}\nType: ${type}\nLock name: ${lock.lockName}\n\nTo Unlock - Press PIN CODE #\n\nNotes: ${beforeString} The # key is the UNLOCKING key at the bottom right. Please don't share your Pin Code with anyone.`
      const res = await Share.open({ message }) // TODO verify the message in different code type
    }
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

const data = [
  { key: 5, label: 'Weekend' },
  { key: 6, label: 'Daily' },
  { key: 7, label: 'Workday' },
  { key: 8, label: 'Monday' },
  { key: 9, label: 'Tuesday' },
  { key: 10, label: 'Wednesday' },
  { key: 11, label: 'Thursday' },
  { key: 12, label: 'Friday' },
  { key: 13, label: 'Saturday' },
  { key: 14, label: 'Sunday' },
];
