import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    isLoading: false,
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationErrors() {
      return {
        authEmail: (function () {
          if (store.authEmail.length === 0) {
            return "can't be blank"
          }
          if (store.authEmail.length < 6) {
            return "must be at least 6 characters"
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail)) {
            return "must be a valid email address"
          }
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length === 0) {
            return "can't be blank"
          }
          if (store.authPassword.length < 6) {
            return "must be at least 6 characters"
          }
          return ""
        })(),
      }
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthPassword(value: string) {
      store.authPassword = value.replace(/ /g, "")
    },
    async login() {
      store.isLoading = true
      const res = await api.login(store.authEmail, store.authPassword)
      store.setProp("isLoading", false)
      if (res.kind === "ok") {
        if (res.data?.accessToken) {
          store.setProp("authToken", res.data.accessToken)
        } else if (res.data?.errmsg) {
          alert(res.data.errmsg)
        } else {
          alert(JSON.stringify(res.data || res))
        }
      } else {
        alert(res.kind)
      }
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.authPassword = ""
    },
  }))
  .preProcessSnapshot((snapshot) => {
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { authPassword, isLoading, authToken, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
