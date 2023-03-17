import { Alert } from "react-native"
import { destroy, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import FileViewer from "react-native-file-viewer";
import Toast from 'react-native-simple-toast';
import { LockRecordType, Ttlock } from "react-native-ttlock"
import { api } from "../services/api"
import { RecordModel } from "./Record"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const RecordStoreModel = types
  .model("RecordStore")
  .props({
    isRefreshing: false,
    isLoading: false,
    lockId: 0,
    records: types.array(RecordModel),
    path: "",
  })
  .views((store) => ({
    get recordList() {
      return store.records.slice()
    },
    get recordList2() {
      const list = store.records
      const res = {}
      list.forEach(item => {
        const date = item.lockDateDescribe.slice(0, 10)
        if (!res[date]) {
          res[date] = [item]
        } else {
          res[date].push(item)
        }
      })
      // console.log("recordList2", Object.keys(res).map(date => ({ title: date, children: res[date] })))
      return Object.keys(res).map(date => ({ title: date, children: res[date] }))
    }
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    // sync actions
    saveLockId(id: number) {
      store.lockId = id
    },

    // saveCardId(id: number) {
    //   store.cardId = id
    // },

    // updateCardNameToStore(cardId: number, cardName: string) {
    //   store.cards.find((c) => c.cardId === cardId)!.cardName = cardName
    // },

    // updateCardPeriodToStore(cardId: number, startDate: number, endDate: number) {
    //   const card = store.cards.find((c) => c.cardId === cardId)!
    //   card.startDate = startDate
    //   card.endDate = endDate
    // },

    removeRecordFromStore(recordId: number) {
      destroy(store.records.find((r) => r.recordId === recordId))
    },

    removeAllRecordsFromStore() {
      destroy(store.records)
    },
  }))
  .actions((store) => ({
    // async actions
    async getRecordList(text?: string) {
      store.isRefreshing = true
      const res: any = await api.getRecordList(store.lockId) // TODO add pagination
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

    async getRecordList2(text?: string) {
      store.isLoading = true
      // text && store.removeAllRecordsFromStore()
      const res: any = await api.getRecordList2(store.lockId, text) // TODO add pagination
      store.setProp("isLoading", false)
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


    async uploadRecords() {
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.getLockOperationRecord(LockRecordType.Latest, lock.lockData, async (records) => {
          console.log(`TTLock: get lock records success: ${(records)}`)
          if (!records) {
            store.setProp("isLoading", false)
            setTimeout(() => Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER), 200)
            return "No new record"
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
      const res: any = await api.deleteRecord(store.lockId, recordId) // TODO add pagination
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.removeRecordFromStore(recordId)
          Toast.showWithGravity("Operation Successful", Toast.SHORT, Toast.CENTER)
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
      // const res = await FileViewer.open(path)
      store.setProp("path", path)
      return "success"
      // switch (res.kind) { TODO check error case
      //   case "ok":
      //     if (res.data?.list) {
      //       store.setProp("records", res.data.list)
      //       // return res.data.list
      //     } else {
      //       alert(JSON.stringify(res))
      //     }
      //     break
      //   case "bad":
      //     Alert.alert(`code: ${res.code}`, res.msg)
      //     break
      //   default:
      //     Alert.alert(res.kind, res.msg)
      // }
      // return null
    },

    async addCard(cardName: string, startDate: number, endDate: number, addType = 1) { // TODO addType can be 2 for gateway
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Toast.showWithGravity("Connecting with Lock. Please wait...", Toast.SHORT, Toast.CENTER)
        Ttlock.addCard(null, startDate, endDate, lock.lockData,
          () => Toast.showWithGravity("Connected. Place the Card against the Card Reader Sensor on the Smart Lock.", Toast.SHORT, Toast.CENTER),
          async (cardNumber) => {
            console.log("TTLock: addCard success", cardNumber)
            const res: any = await api.addCard(lock.lockId, cardNumber, cardName, startDate, endDate, addType) // addType by default is 1, TODO gateway is 2
            store.setProp("isLoading", false)
            switch (res.kind) {
              case "ok":
                setTimeout(() => Toast.showWithGravity("Added Successfully", Toast.SHORT, Toast.CENTER), 200)
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

    async updateCard(startDate: number, endDate: number, changeType = 1) { // TODO changeType can be 2 for gateway
      store.isLoading = true
      const card = store.cards.find((c) => c.cardId === store.cardId)!
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.modifyCardValidityPeriod(card.cardNumber, null, startDate, endDate, lock.lockData, async () => {
          console.log("TTLock: modify card success")
          const res: any = await api.updateCard(lock.lockId, card.cardId, startDate, endDate, changeType)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.updateCardPeriodToStore(card.cardId, startDate, endDate)
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

    async updateCardName(cardName: string) {
      store.isLoading = true
      const res: any = await api.updateCardName(store.lockId, store.cardId, cardName)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.updateCardNameToStore(store.cardId, cardName)
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

    async deleteCard(cardId: number, deleteType?: number) { // TODO make TTLock library promisable
      store.isLoading = true
      const card = store.cards.find((c) => c.cardId === cardId)!
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.deleteCard(card.cardNumber, lock.lockData, async () => {
          console.log("TTLock: deleteCard success")
          const res: any = await api.deleteCard(store.lockId, cardId, deleteType || 1) // deleteType by default is 1, TODO gateway is 2
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.removeCardFromStore(cardId)
              setTimeout(() => Toast.showWithGravity("Deleted", Toast.SHORT, Toast.CENTER), 200)
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

    async clearAllCards() {
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.clearAllCards(lock.lockData, async () => {
          console.log("TTLock: reset cards success")
          const res: any = await api.clearCards(lock.lockId)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.removeAllCardsFromStore()
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
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { isLoading, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface RecordStore extends Instance<typeof RecordStoreModel> {}
export interface RecordStoreSnapshot extends SnapshotOut<typeof RecordStoreModel> {}

// @demo remove-file
