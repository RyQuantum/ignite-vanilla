import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a record of a lock.
 */
export const RecordModel = types
  .model("Record")
  .props({
      recordId: types.number,
      lockId: types.number,
      serverDate: types.number,
      hotelUsername: types.maybe(types.string),
      recordType: types.number,
      success: types.number,
      keyName: types.maybe(types.string),
      keyboardPwd: types.string,
      lockDate: types.number,
      username: types.string
  })
  .actions(withSetPropAction)
  // .views((code) => ({}))

export interface Record extends Instance<typeof RecordModel> {}
export interface RecordSnapshotOut extends SnapshotOut<typeof RecordModel> {}
export interface RecordSnapshotIn extends SnapshotIn<typeof RecordModel> {}

// @demo remove-file
