import React, { FC, useEffect, useRef, useState } from "react"
import { BackHandler, DeviceEventEmitter, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from 'react-native-video';
import { useStores } from "../../models"
import { Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

const video = require("../../../assets/videos/fingerprint.mp4")
export const LearnFingerprintScreen: FC<any> = observer(function LearnFingerprintScreen(props) {
  const {
    fingerprintStore: { updateFingerprint },
  } = useStores()

  const player = useRef(null)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Fingerprint",
      headerLeft: () => null,
      gestureEnabled: false
    })
    DeviceEventEmitter.addListener("progress", (progress) => {
      setPaused(false)
      setTimeout(() => setPaused(true), 750)
    })
    DeviceEventEmitter.addListener("success", (data) => {
      setPaused(false)
      alert(`success - fingerprintId: ${data.fingerprintNumber}`)
    })
    DeviceEventEmitter.addListener("fail", (err) => {

    })

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
    return () => backHandler.remove()
  }, [])


  // useEffect(() => {
  //   setTimeout(() => setPaused(true), 750)
  //   setTimeout(() => setPaused(false), 1750)
  //   setTimeout(() => setPaused(true), 2500)
  //   setTimeout(() => setPaused(false), 3500)
  //   setTimeout(() => setPaused(true), 4250)
  //   setTimeout(() => setPaused(false), 5250)
  //   setTimeout(() => setPaused(true), 6000)
  // }, [])

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <DemoDivider />
      <Video
        source={video} // Can be a URL or a local file.
        ref={player} // Store reference
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onError={this.videoError}               // Callback when video cannot be loaded
        // repeat
        paused={paused}
        style={$backgroundVideo}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
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
