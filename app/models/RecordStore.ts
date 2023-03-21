import { Alert } from "react-native"
import { destroy, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import Toast from 'react-native-simple-toast';
import { LockRecordType, Ttlock } from "react-native-ttlock"
import { api } from "../services/api"
import { Record, RecordModel } from "./Record"
import { withSetPropAction } from "./helpers/withSetPropAction"

type Title = {
  title: string
}
export const RecordStoreModel = types
  .model("RecordStore")
  .props({
    isRefreshing: false, // Deprecated
    isLoading: false,
    lockId: 0,
    searchText: "",
    recordType: 0,
    pageNo: 1,
    pages: 0,
    records: types.array(RecordModel),
    path: "",
  })
  .views((store) => ({
    get recordListAndIndices() {
      const dates: string[] = []
      const indices: number[] = []
      const recordList: Record | Title[] = []
      store.records.forEach(item => {
        const date = item.lockDateDescribe.slice(0, 10)
        if (dates[dates.length - 1] !== date) {
          dates.push(date)
          indices.push(recordList.length)
          recordList.push({ title: date })
        }
        recordList.push(item)
      })
      return { indices, recordList }
    }
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    // sync actions
    saveLockId(id: number) {
      store.lockId = id
    },

    removeRecordFromStore(recordId: number) {
      destroy(store.records.find((r) => r.recordId === recordId))
    },

    removeAllRecordsFromStore() {
      destroy(store.records)
    },
  }))
  .actions((store) => ({
    // async actions
    async getRecordList0(text?: string) {
      store.isRefreshing = true
      const res: any = await api.getRecordList0(store.lockId) // TODO add pagination
      store.setProp("isRefreshing", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.list) {
            store.setProp("records", res.data.list)
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

    async getRecordList(searchText = "", recordType?: number, pageNo?: number) {
      if (searchText !== store.searchText || pageNo === 1) {
        store.searchText = searchText
        if (recordType) {
          store.recordType = recordType
        } else {
          store.recordType = 0
        }
        store.pageNo = 1
        store.pages = 0
      } else {
        if (store.pages < store.pageNo + 1) return null
        store.pageNo += 1
      }
      store.isLoading = true
      const res: any = await api.getRecordList(store.lockId, store.searchText, store.recordType, store.pageNo)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.list) {
            if (pageNo === 1) {
              store.setProp("records", res.data.list)
            } else {
              store.setProp("records", [...store.records, ...res.data.list])
            }
            store.setProp("pages", res.data.pages)
            return res.data.list
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

    async uploadRecords() {
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.getLockOperationRecord(LockRecordType.Latest, lock.lockData, async (records) => {
          console.log(`TTLock: get lock records success: ${(records)}`)
          if (!records) {
            store.setProp("isLoading", false)
            setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
            return null
          }
          const res: any = await api.uploadRecords(lock.lockId, records)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
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

    async deleteRecord(recordId: number) {
      store.isLoading = true
      const res: any = await api.deleteRecords(store.lockId, [recordId])
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.removeRecordFromStore(recordId)
          setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async deleteAllRecords() {
      store.isLoading = true
      const res: any = await api.deleteAllRecords(store.lockId)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.removeAllRecordsFromStore()
          setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
          return res.data
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
      return null
    },

    async exportExcel(startDate: number, endDate: number) {
      store.isLoading = true
      const path: any = await api.exportExcel(store.lockId, startDate, endDate) // TODO add pagination
      store.setProp("isLoading", false)
      if (typeof path !== "string") {
        return Alert.alert(path.message)
      }
      store.setProp("path", path)
      return "success"
    },
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { isLoading, searchText, recordType, pageNo, pages, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot extends SnapshotOut<typeof RecordStoreModel> {}

// @demo remove-file
