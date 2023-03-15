import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line
import { LockStoreModel } from "./LockStore"
import { CodeStoreModel } from "./CodeStore"
import { CardStoreModel } from "./CardStore"
import { FingerprintStoreModel } from "./FingerprintStore"
import { RecordStoreModel } from "./RecordStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
  lockStore: types.optional(LockStoreModel, {}), // @demo remove-current-line
  codeStore: types.optional(CodeStoreModel, {}), // @demo remove-current-line
  cardStore: types.optional(CardStoreModel, {}), // @demo remove-current-line
  fingerprintStore: types.optional(FingerprintStoreModel, {}), // @demo remove-current-line
  recordStore: types.optional(RecordStoreModel, {}), // @demo remove-current-line
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
