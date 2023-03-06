import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

interface LockVersion {
  showAdminKbpwdFlag: false
  groupId: number
  protocolVersion: number
  protocolType: number
  orgId: number
  logoUrl: string
  scene: number
}

/**
 * This represents an episode of React Native Radio.
 */
export const LockModel = types
  .model("Lock")
  .props({
    lockName: "",
    lockAlias: "",
    lockMac: "",
    lockId: 0,
    specialValue: 0,
    lockVersion: types.frozen<LockVersion>(),
    keyId: 0,
    keyStatus: "",
    startDate: 0,
    endDate: 0,
    userType: "",
    noKeyPwd: "",
    deletePwd: "",
    timezoneRawOffset: 0,
    featureValue: "",
    electricQuantity: 0,
    lockData: "",
    keyboardPwdVersion: 0,
    remoteEnable: 0,
    wirelessKeypadFeatureValue: "",
    remarks: "",
    keyRight: 0,
    date: 0,
    groupId: types.maybe(types.number),
    groupName: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  // .views((lock) => ({}))

export interface Lock extends Instance<typeof LockModel> {}
export interface LockSnapshotOut extends SnapshotOut<typeof LockModel> {}
export interface LockSnapshotIn extends SnapshotIn<typeof LockModel> {}

// @demo remove-file
