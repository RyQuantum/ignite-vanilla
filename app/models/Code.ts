import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a passcode of a lock.
 */
export const CodeModel = types
  .model("Code")
  .props({
      endDate: 0,
      sendDate: 0,
      keyboardPwdId: 0,
      nickName: "",
      keyboardPwdType: 0,
      lockId: 0,
      keyboardPwdVersion: 0,
      isCustom: 0,
      keyboardPwdName: "",
      keyboardPwd: "",
      startDate: 0,
      senderUsername: "",
      receiverUsername: "",
      status: 0,
  })
  .actions(withSetPropAction)
  // .views((code) => ({}))

export interface Code extends Instance<typeof CodeModel> {}
export interface CodeSnapshotOut extends SnapshotOut<typeof CodeModel> {}
export interface CodeSnapshotIn extends SnapshotIn<typeof CodeModel> {}

// @demo remove-file
