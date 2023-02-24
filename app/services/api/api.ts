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
  ApiFeedResponse, ApiLoginResponse, // @demo remove-current-line
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
      console.log(`Request:[${method}] ${baseURL}${url} data:${JSON.stringify(data)}`)
      return { baseURL, url, data, method, ...rest };
    })
    this.apisauce.axiosInstance.interceptors.response.use((res) => {
      console.log(`Response: ${res.request.responseURL} data:${JSON.stringify(res.data)}`)
      return res;
    }, (error) => {
      console.log("error:", error)
      return error
    })
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

  @parseResult()
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
    return response
  }

  @parseResult()
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
    return response
  }

  @parseResult()
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
    return response
  }

  @parseResult()
  async getKeyList(pageNo = 1, pageSize = 20) {
    const formData = new FormData()
    formData.append("pageNo", pageNo.toString())
    formData.append("pageSize", pageSize.toString())
    formData.append("date", Date.now().toString())
    const response = await this.apisauce.post( // TODO ApiLoginResponse => ApiGetKeyListResponse
      "key/list",
      formData
    )
    return response
  }

  @parseResult()
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
    return response
  }
}

function parseResult() {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(... params: any[])=> Promise<any>>) => {
    const oldFunc = descriptor.value;
    descriptor.value = async function (){
      const response = await oldFunc.apply(this, arguments);
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
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
