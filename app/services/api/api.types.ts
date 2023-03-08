/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface ApiLoginResponse {
  code: number, // TODO needs to find a way to utilize the definition for other response
  msg: string,
  data: {
    uid: number,
    countryCode: string
    isSecurityQuestionSetted: boolean
    nickname: string
    mobile: string
    headimgurl: string
    accessToken: string
    account: string
    email: string
  }
}

type Key = {
  "date": number,
  "specialValue": number,
  "lockAlias": string,
  "keyStatus": "110401" | string,
  "endDate": number,
  "noKeyPwd": string,
  "keyId": number,
  "lockMac": string,
  "deletePwd": string,
  "timezoneRawOffset": number,
  "featureValue": string,
  "lockId": number,
  "electricQuantity": number,
  "lockData": string,
  "keyboardPwdVersion": number,
  "remoteEnable": number,
  "wirelessKeypadFeatureValue": string,
  "lockVersion": {
    "showAdminKbpwdFlag": boolean,
    "groupId": number,
    "protocolVersion": number,
    "protocolType": number,
    "orgId": number,
    "logoUrl": string,
    "scene": number
  },
  "userType": "110301" | "110302",
  "lockName": string,
  "startDate": number,
  "remarks": string,
  "keyRight": number
}
export interface ApiGetKeyListResponse {
  code: number,
  msg: string,
  data: {
    "total": number,
    "pages": number,
    "pageNo": number,
    "pageSize": number,
    "list": Key[],
  }
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
