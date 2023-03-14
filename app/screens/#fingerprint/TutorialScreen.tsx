import React, { FC, useEffect, useRef, useState } from "react"
import { DeviceEventEmitter, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from "react-native-video";
import { useStores } from "../../models"
import { Text, Screen, CustomButton } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"
import Spinner from "react-native-loading-spinner-overlay"
import { Ttlock } from "react-native-ttlock"

const video = require("../../../assets/videos/tutorial.mp4")
export const TutorialScreen: FC<any> = observer(function TutorialScreen(props) {
  const {
    fingerprintStore: { updateFingerprint, lockId },
    lockStore: { lockList }
  } = useStores()

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Fingerprint"
    })
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  const player = useRef(null)
  const lock = lockList.find(l => l.lockId === lockId)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
      <Text style={{ padding: 20, textAlign: "center" }}>You will be required to Place your Finger to the Sensor several times. Please follow the prompts...</Text>
      <DemoDivider size={28} />
      <Video
        source={video} // Can be a URL or a local file.
        ref={player} // Store reference
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onError={this.videoError}               // Callback when video cannot be loaded
        repeat
        style={$backgroundVideo}
      />
      <DemoDivider size={16} />
      <CustomButton onPress={() => {
        setIsLoading(true)
        Ttlock.addFingerprint(null, 0, 0, lock.lockData, (currentCount, totalCount) => {
          console.log("currentCount", currentCount, "totalCount", totalCount)
          DeviceEventEmitter.emit("progress", { currentCount, totalCount })
          if (currentCount === 0) {
            setIsLoading(false)
            props.navigation.navigate("Learn Fingerprint")
          }
        }, (fingerprintNumber) => {
          console.log("fingerprintNumber", fingerprintNumber)
          DeviceEventEmitter.emit("success", { fingerprintNumber })
        }, (errorCode, description) => {
          console.log("err", errorCode, description)
          DeviceEventEmitter.emit("fail", { errorCode, description })
        })
      }}>Next</CustomButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  // justifyContent: "center",
  // alignItems: "center",
  height: "100%",
}

const $backgroundVideo = {
  // position: "absolute",
  // top: 0,
  // left: 0,
  // bottom: 0,
  // right: 0,
  height: 300
}
