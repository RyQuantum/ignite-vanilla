import { AppRegistry } from "react-native"
import { name as appName } from "./app.json"

import App from "./app/app.tsx"
import React from "react"
// import RNBootSplash from "react-native-bootsplash"

if (__DEV__) {
  const log = console.log
  console.log = function(...params) {
    log(`[${new Date().toISOString()}]`, ...params)
  }
}
function IgniteApp() {
  // return <App hideSplashScreen={RNBootSplash.hide} />;
  return <App />
}

AppRegistry.registerComponent(appName, () => IgniteApp)
