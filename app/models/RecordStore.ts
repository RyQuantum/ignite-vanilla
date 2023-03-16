import { Alert } from "react-native"
import { destroy, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { RecordModel } from "./Record"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Ttlock } from "react-native-ttlock"
import Toast from 'react-native-simple-toast';

export const RecordStoreModel = types
  .model("RecordStore")
  .props({
    isRefreshing: false,
    isLoading: false,
    lockId: 0,
    records: types.array(RecordModel),
  })
  .views((store) => ({
    get recordList() {
      return store.records.slice()
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    // sync actions
    saveLockId(id: number) {
      store.lockId = id
    },

    saveCardId(id: number) {
      store.cardId = id
    },

    updateCardNameToStore(cardId: number, cardName: string) {
      store.cards.find((c) => c.cardId === cardId)!.cardName = cardName
    },

    updateCardPeriodToStore(cardId: number, startDate: number, endDate: number) {
      const card = store.cards.find((c) => c.cardId === cardId)!
      card.startDate = startDate
      card.endDate = endDate
    },

    removeCardFromStore(cardId: number) {
      destroy(store.cards.find((c) => c.cardId === cardId))
    },

    removeAllRecordsFromStore() {
      destroy(store.records)
    },
  }))
  .actions((store) => ({
    // async actions
    async getRecordList2() {
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

    async getRecordList() {
      store.isRefreshing = true
      // const res: any = await api.getRecordList(store.lockId) // TODO add pagination
      const res: any = await api.getRecordList2(store.lockId) // TODO add pagination
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
