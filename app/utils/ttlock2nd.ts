
export function parseFeatureValueWithIndex(featureValue: string, index: number): boolean {
  return parseInt(featureValue, 16).toString(2).split("").reverse()[index] === "1"
}
