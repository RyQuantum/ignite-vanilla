import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

const CyclicConfig = types.model({
      weekDay: types.number,
      startTime: types.number,
      endTime: types.number,
})

/**
 * This represents a fingerprint of a lock.
 */
export const FingerprintModel = types
  .model("Fingerprint")
  .props({
      lockId: types.number,
      fingerprintType: types.number,
      fingerprintNumber: types.string,
      fingerprintName: types.string,
      endDate: types.number,
      nickName: types.string,
      fingerprintId: types.number,
      userId: types.string,
      startDate: types.number,
      senderUsername: types.string,
      createDate: types.number,
      status: types.number,
      cyclicConfig: types.array(CyclicConfig)
  })
  .actions(withSetPropAction)
  // .views((code) => ({}))

export interface Fingerprint extends Instance<typeof FingerprintModel> {}
export interface FingerprintSnapshotOut extends SnapshotOut<typeof FingerprintModel> {}
export interface FingerprintSnapshotIn extends SnapshotIn<typeof FingerprintModel> {}

// @demo remove-file
