import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a card of a lock.
 */
export const CardModel = types
  .model("Card")
  .props({
      lockId: types.number,
      cardName: types.string,
      endDate: types.number,
      nickName: types.string,
      cardId: types.number,
      cardType: types.number,
      userId: types.string,
      cardNumber: types.string,
      startDate: types.number,
      senderUsername: types.string,
      createDate: types.number,
      status: types.number,
  })
  .actions(withSetPropAction)
  // .views((code) => ({}))

export interface Card extends Instance<typeof CardModel> {}
export interface CodeSnapshotOut extends SnapshotOut<typeof CardModel> {}
export interface CodeSnapshotIn extends SnapshotIn<typeof CardModel> {}

// @demo remove-file
