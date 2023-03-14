import { Alert } from "react-native"
import { destroy, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { FingerprintModel } from "./Fingerprint"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Ttlock } from "react-native-ttlock"
import Toast from 'react-native-simple-toast';

export const FingerprintStoreModel = types
  .model("FingerprintStore")
  .props({
    isRefreshing: false,
    isLoading: false,
    lockId: 0,
    fingerprintId: 0,
    fingerprints: types.array(FingerprintModel),
  })
  .views((store) => ({
    get fingerprintList() {
      return store.fingerprints.slice()
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    // sync actions
    saveLockId(id: number) {
      store.lockId = id
    },

    saveFingerprintId(id: number) {
      store.fingerprintId = id
    },

    updateFingerprintNameToStore(fingerprintId: number, fingerprintName: string) {
      store.fingerprints.find((f) => f.fingerprintId === fingerprintId)!.fingerprintName = fingerprintName
    },

    updateFingerprintPeriodToStore(fingerprintId: number, startDate: number, endDate: number) {
      const fingerprint = store.fingerprints.find((f) => f.fingerprintId === fingerprintId)!
      fingerprint.startDate = startDate
      fingerprint.endDate = endDate
    },

    removeFingerprintFromStore(fingerprintId: number) {
      destroy(store.fingerprints.find((f) => f.fingerprintId === fingerprintId))
    },

    removeAllFingerprintsFromStore() {
      destroy(store.fingerprints)
    },
  }))
  .actions((store) => ({
    // async actions
    async getFingerprintList() {
      store.isRefreshing = true
      const res: any = await api.getFingerprintList(store.lockId) // TODO add pagination
      store.setProp("isRefreshing", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.list) {
            store.setProp("fingerprints", res.data.list)
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

    async updateFingerprint(startDate: number, endDate: number, changeType = 1) { // TODO changeType can be 2 for gateway
      store.isLoading = true
      const fingerprint = store.fingerprints.find((f) => f.fingerprintId === store.fingerprintId)!
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.modifyFingerprintValidityPeriod(fingerprint.fingerprintNumber, null, startDate, endDate, lock.lockData, async () => {
          console.log("TTLock: modify fingerprint success")
          const res: any = await api.updateFingerprint(lock.lockId, fingerprint.fingerprintId, startDate, endDate, changeType)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.updateFingerprintPeriodToStore(fingerprint.fingerprintId, startDate, endDate)
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

    async updateFingerprintName(fingerprintName: string) {
      store.isLoading = true
      const res: any = await api.updateFingerprintName(store.lockId, store.fingerprintId, fingerprintName)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.updateFingerprintNameToStore(store.fingerprintId, fingerprintName)
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

    async deleteFingerprint(fingerprintId: number, deleteType?: number) { // TODO make TTLock library promisable
      store.isLoading = true
      const fingerprint = store.fingerprints.find((f) => f.fingerprintId === fingerprintId)!
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.deleteFingerprint(fingerprint.fingerprintNumber, lock.lockData, async () => {
          console.log("TTLock: deleteFingerprint success")
          const res: any = await api.deleteFingerprint(store.lockId, fingerprintId, deleteType || 1) // deleteType by default is 1, TODO gateway is 2
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.removeFingerprintFromStore(fingerprintId)
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

    async clearAllFingerprints() {
      store.isLoading = true
      const lock = getRoot(store).lockStore.locks.find((l) => l.lockId === store.lockId)
      return new Promise((resolve) => {
        Ttlock.clearAllFingerprints(lock.lockData, async () => {
          console.log("TTLock: reset fingerprints success")
          const res: any = await api.clearFingerprints(lock.lockId)
          store.setProp("isLoading", false)
          switch (res.kind) {
            case "ok":
              store.removeAllFingerprintsFromStore()
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

export interface FingerprintStore extends Instance<typeof FingerprintStoreModel> {}
export interface FingerprintStoreSnapshot extends SnapshotOut<typeof FingerprintStoreModel> {}

// @demo remove-file
