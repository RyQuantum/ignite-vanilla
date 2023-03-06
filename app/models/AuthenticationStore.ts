import { Alert } from "react-native"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Country } from "react-native-country-picker-modal"
import { stringMd5 } from "react-native-quick-md5"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    isLoading: false,
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
    registerEmail: "",
    registerPhone: "",
    registerPassword: "",
    registerConfirmPassword: "",
    verificationCode: "",
    count: -1,
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationErrors() {
      return {
        registerEmail: (function () {
          if (store.registerEmail.length === 0) {
            return ""
          }
          if (store.registerEmail.length < 6) {
            return "must be at least 6 characters"
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.registerEmail)) {
            return "must be a valid email address"
          }
          return ""
        })(),
        registerPhone: (function () {
          if (store.registerPhone.length === 0) {
            return ""
          }
          if (!/^\d{10}$/.test(store.registerPhone)) {
            return "must be 10-digit numbers"
          }
          return ""
        })(),
        registerPassword: (function () {
          if (store.registerPassword.length === 0) {
            return ""
          }
          if (store.registerPassword.length < 8) {
            return "must be at least 8 characters"
          }
          if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,50}$/.test(store.registerPassword)) {
            return "must be at least two types of numbers, letters and symbols"
          }
          if (store.registerPassword.length > 20) {
            return "must be maximum 20 characters"
          }
          return ""
        })(),
        registerConfirmPassword: (function () {
          if (store.registerConfirmPassword.length === 0) {
            return ""
          }
          if (store.registerPassword !== store.registerConfirmPassword) {
            return "2 passwords you entered did not match"
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
    setRegisterEmail(value: string) {
      store.registerEmail = value.replace(/ /g, "")
    },
    setRegisterPhone(value: string) {
      store.registerPhone = value.replace(/ /g, "")
    },
    setRegisterPassword(value: string) {
      store.registerPassword = value.replace(/ /g, "")
    },
    setRegisterConfirmPassword(value: string) {
      store.registerConfirmPassword = value.replace(/ /g, "")
    },
    setCode(value: string) {
      store.verificationCode = value.replace(/ /g, "")
    },
    startCountDown() {
      store.count = 60
      const interval = setInterval(() => {
        if (store.count === 0) clearInterval(interval)
        store.setProp("count", store.count - 1)
      }, 1000)
    },

    async sendVerificationCode(country: Country | null, index: number) {
      store.isLoading = true
      const contactInfo = index === 0 ? { email: store.registerEmail } : { mobile: store.registerPhone }
      const res: any = await api.sendVerificationCode("+" + (country?.callingCode[0] || "1"), contactInfo)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          store.setProp("count", 60)
          const interval = setInterval(() => {
            if (store.count === 0) clearInterval(interval)
            store.setProp("count", store.count - 1)
          }, 1000)
          Alert.alert("Security Verification", "Please enter the verification code that was sent to " + (index === 0 ? store.registerEmail : store.registerPhone))
          break
        case "bad":
          Alert.alert(`code: ${res.code}`, res.msg)
          break
        default:
          Alert.alert(res.kind, res.msg)
      }
    },

    async register(country: Country | null, index: number) {
      store.isLoading = true
      const contactInfo = index === 0 ? { email: store.registerEmail } : { mobile: store.registerPhone }
      const res: any = await api.register(contactInfo, "+" + (country?.callingCode[0] || "1"), stringMd5(store.registerPassword), store.verificationCode)
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.accessToken) {
            store.setProp("authToken", res.data.accessToken)
            store.setProp("authEmail", res.data.account)
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
    },

    async login() {
      store.isLoading = true
      const res: any = await api.login(store.authEmail, stringMd5(store.authPassword))
      store.setProp("isLoading", false)
      switch (res.kind) {
        case "ok":
          if (res.data?.accessToken) {
            store.setProp("authToken", res.data.accessToken)
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
    },

    logout() {
      store.authToken = undefined
      api.setAuthorizationToken("")
      store.authEmail = ""
      store.authPassword = ""
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

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
