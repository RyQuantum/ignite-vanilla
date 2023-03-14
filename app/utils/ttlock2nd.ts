import moment from "moment-timezone"

let currentTimezone = moment.tz.guess()

export function parseFeatureValueWithIndex(featureValue: string, index: number): boolean {
  return parseInt(featureValue, 16).toString(2).split("").reverse()[index] === "1"
}

export const convertTimeStamp = (timestamp: number) => {
  currentTimezone = moment.tz.guess() // TODO find a way to sync the timezone in a unified place
  return moment(timestamp).tz(currentTimezone).format("YYYY.MM.DD HH:mm")
}

export const convertTimeStampToDate = (timestamp: number) => {
  currentTimezone = moment.tz.guess()
  return moment(timestamp).tz(currentTimezone).format("YYYY.MM.DD")
}

export const convertTimeStampToTime = (timestamp: number) => {
  currentTimezone = moment.tz.guess()
  return moment(timestamp).tz(currentTimezone).format("HH:mm")
}
