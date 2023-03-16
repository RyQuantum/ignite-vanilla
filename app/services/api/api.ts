/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import qs from 'qs';
import { getUniqueId } from 'react-native-device-info';
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse,
  ApiGetKeyListResponse,
  ApiLoginResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.apisauce.axiosInstance.interceptors.request.use(({ baseURL, url, data, method, ...rest }) => {
      console.log(`Request:[${method}] ${baseURL}${url} data:${JSON.stringify(data)} Authorization:${rest.headers.Authorization}`)
      return { baseURL, url, data, method, ...rest };
    })
    this.apisauce.axiosInstance.interceptors.response.use(null, (error) => {
      console.log("Error:", error)
      return error
    })
    this.apisauce.addMonitor((res) => {
      console.log(`Response: ${res.config.baseURL + res.config.url} data:${JSON.stringify(res.data)} duration:${res.duration}ms`)
    });
  }

  setAuthorizationToken(accessToken: string) {
    this.apisauce.setHeaders({ Authorization: accessToken })
  }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      "api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx",
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  // @demo remove-block-end

  async sendVerificationCode(countryCode: string, contactInfo: { email?: string; mobile?: string }) {
    const body = { countryCode, twilioType: "1", ...contactInfo }
    const response = await this.apisauce.post( // TODO ApiGetVerificationCodeResponse
      "user/sendValidationCode",
      // formData,
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async register(contactInfo: { mobile?: string; phone?: string }, countryCode: string, password: string, verificationCode: string) {
    const uniqueid = await getUniqueId() // TODO uid should be discussed
    const body: { countryCode: string, password: string, verificationCode: string, uniqueid: string, date: number, mobile?: string, email?: string } = {
      countryCode,
      password,
      verificationCode,
      uniqueid,
      ...contactInfo,
      date: Date.now()
    }
    const response = await this.apisauce.post( // TODO ApiRegisterResponse
      "user/register",
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async login(username: string, password: string) {
    const response: ApiResponse<ApiLoginResponse> = await this.apisauce.post(
      "user/login",
      qs.stringify({
        account: username,
        password,
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async getKeyList(pageNo = 1, pageSize = 100) { // TODO support pagination
    const formData = new FormData()
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response: ApiResponse<ApiGetKeyListResponse> = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "key/list",
      formData
    )
    return parseResponse(response)
  }

  async initialize(lockData: string, lockAlias: string) {
    const response = await this.apisauce.post(
      "lock/initialize",
      // formData,
      qs.stringify({
        lockData,
        lockAlias,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async rename(lockId: number, lockAlias: string) {
    const response = await this.apisauce.post(
      "lock/rename",
      // formData,
      qs.stringify({
        lockId,
        lockAlias,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async getCodeList(lockId: number, pageNo = 1, pageSize = 20) {
    const formData = new FormData()
    formData.append("lockId", lockId.toString())
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "lock/listKeyboardPwd",
      formData
    )
    return parseResponse(response)
  }

  async addCode(lockId: number, keyboardPwd: string, keyboardPwdName: string, startDate: number, endDate: number, addType: number) {
    const body: { lockId: number, keyboardPwd: string, keyboardPwdName?: string, startDate: number, endDate: number, addType: number, date: number } = {
      lockId,
      keyboardPwd,
      startDate,
      endDate,
      addType,
      date: Date.now()
    }
    if (keyboardPwdName) {
      body.keyboardPwdName = keyboardPwdName
    }
    const response = await this.apisauce.post(
      "keyboardPwd/add",
      // formData,
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async generateCode(lockId: number, keyboardPwdType: number, keyboardPwdName: string, startDate: number, endDate?: number) {
    const body: { lockId: number, keyboardPwdType: number, keyboardPwdName?: string, startDate: number, endDate?: number, date: number } = {
      lockId,
      keyboardPwdType,
      startDate,
      date: Date.now()
    }
    if (keyboardPwdName) {
      body.keyboardPwdName = keyboardPwdName
    }
    if (endDate) {
      body.endDate = endDate
    }
    const response = await this.apisauce.post(
      "keyboardPwd/get",
      // formData,
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateCode(lockId: number, keyboardPwdId: number, keyboardPwdName?: string, newKeyboardPwd?: string, startDate?: number, endDate?: number, changeType?: number) {
    const body: { lockId: number, keyboardPwdId: number, keyboardPwdName?: string, newKeyboardPwd?: string, startDate?: number, endDate?: number, changeType?: number, date: number } = {
      lockId,
      keyboardPwdId,
      date: Date.now()
    }
    if (keyboardPwdName) {
      body.keyboardPwdName = keyboardPwdName
    }
    if (newKeyboardPwd) {
      body.newKeyboardPwd = newKeyboardPwd
    }
    if (startDate) {
      body.startDate = startDate
    }
    if (endDate) {
      body.endDate = endDate
    }
    if (changeType) {
      body.changeType = changeType
    }
    const response = await this.apisauce.post(
      "keyboardPwd/change",
      // formData,
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async deleteCode(lockId: number, keyboardPwdId: number, deleteType: number) {
    const response = await this.apisauce.post(
      "keyboardPwd/delete",
      // formData,
      qs.stringify({
        lockId,
        keyboardPwdId,
        deleteType,
        date: Date.now()
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateLock(lockId: number, lockData: string) {
    const response = await this.apisauce.post(
      "lock/updateLockData",
      // formData,
      qs.stringify({
        lockId,
        lockData,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async deleteLock(keyId: number) {
    const response = await this.apisauce.post(
      "key/delete",
      qs.stringify({
        keyId,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async getCardList(lockId: number, pageNo = 1, pageSize = 20) {
    const formData = new FormData()
    formData.append("lockId", lockId.toString())
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "identityCard/list",
      formData
    )
    return parseResponse(response)
  }

  async addCard(lockId: number, cardNumber: string, cardName: string, startDate: number, endDate: number, addType: number) {
    const body: { lockId: number, cardNumber: string, cardName: string, startDate: number, endDate: number, addType: number, date: number } = {
      lockId,
      cardNumber,
      cardName,
      startDate,
      endDate,
      addType,
      date: Date.now()
    }
    const response = await this.apisauce.post(
      "identityCard/add",

      // formData,
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async deleteCard(lockId: number, cardId: number, deleteType: number) {
    const response = await this.apisauce.post(
      "identityCard/delete",
      // formData,
      qs.stringify({
        lockId,
        cardId,
        deleteType,
        date: Date.now()
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async clearCards(lockId: number) {
    const response = await this.apisauce.post(
      "identityCard/clear",
      qs.stringify({
        lockId,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateCard(lockId: number, cardId: number, startDate: number, endDate: number, changeType: number) {
    const response = await this.apisauce.post(
      "identityCard/changePeriod",
      qs.stringify({
        lockId,
        cardId,
        startDate,
        endDate,
        changeType,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateCardName(lockId: number, cardId: number, cardName: string) {
    const response = await this.apisauce.post(
      "identityCard/rename",
      qs.stringify({
        lockId,
        cardId,
        cardName,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async getFingerprintList(lockId: number, pageNo = 1, pageSize = 20) {
    const formData = new FormData()
    formData.append("lockId", lockId.toString())
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "fingerprint/list",
      formData
    )
    return parseResponse(response)
  }

  async uploadFingerprint(lockId: number, fingerprintNumber: number, fingerprintType: number, fingerprintName: string, startDate: number, endDate: number, cyclicConfig: object[] | null) {
    const body: { lockId: number, fingerprintNumber: number, fingerprintType: number, fingerprintName: string, startDate: number, endDate: number, date: number, cyclicConfig?: string } = {
      lockId,
      fingerprintNumber,
      fingerprintType,
      fingerprintName,
      startDate,
      endDate,
      date: Date.now()
    }
    if (cyclicConfig) {
      body.cyclicConfig = JSON.stringify(cyclicConfig)
    }
    const response = await this.apisauce.post(
      "fingerprint/add",
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateFingerprint(lockId: number, fingerprintId: number, startDate: number, endDate: number, changeType: number, cyclicConfig?: object[]) {
    const body: { lockId: number, fingerprintId: number, startDate: number, endDate: number, changeType: number, date: number, cyclicConfig?: string } = {
      lockId,
      fingerprintId,
      startDate,
      endDate,
      changeType,
      date: Date.now()
    }
    if (cyclicConfig) {
      body.cyclicConfig = JSON.stringify(cyclicConfig)
    }
    const response = await this.apisauce.post(
      "fingerprint/changePeriod",
      qs.stringify(body, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async updateFingerprintName(lockId: number, fingerprintId: number, fingerprintName: string) {
    const response = await this.apisauce.post(
      "fingerprint/rename",
      qs.stringify({
        lockId,
        fingerprintId,
        fingerprintName,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async deleteFingerprint(lockId: number, fingerprintId: number, deleteType: number) {
    const response = await this.apisauce.post(
      "fingerprint/delete",
      // formData,
      qs.stringify({
        lockId,
        fingerprintId,
        deleteType,
        date: Date.now()
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async clearFingerprints(lockId: number) {
    const response = await this.apisauce.post(
      "fingerprint/clear",
      qs.stringify({
        lockId,
        date: Date.now() // TODO new system is not needed
      }, { encode: true }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      }
    )
    return parseResponse(response)
  }

  async getRecordList(lockId: number, pageNo = 1, pageSize = 100) {
    const formData = new FormData()
    formData.append("lockId", lockId.toString())
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "lockRecord/list",
      formData
    )
    return parseResponse(response)
  }

  async getRecordList2(lockId: number, pageNum = 2, pageSize = 200) {
    const params = { pageNum, pageSize }
    const formData = new FormData()
    formData.append("lockId", lockId.toString())
    // formData.append("pageNo", pageNo.toString())
    // formData.append("pageSize", pageSize.toString())
    // formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "lockRecordCall/list",
      formData,
      { params }
    )
    return parseResponse(response)
  }
}

function parseResponse(response) {
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) {
      return { ...problem, msg: response.originalError.message }
    }
  }
  if (response.data?.code === 200) {
    return { kind: "ok", data: response.data.data }
  } else {
    return { kind: "bad", ...response.data }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
