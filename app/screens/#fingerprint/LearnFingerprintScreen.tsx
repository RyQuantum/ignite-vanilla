import React, { FC, useEffect, useRef } from "react"
import { ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from 'react-native-video';
import { useStores } from "../../models"
import { Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

const video = require("../../../assets/videos/tutorial.mp4")
export const LearnFingerprintScreen: FC<any> = observer(function LearnFingerprintScreen(props) {
  const {
    fingerprintStore: { updateFingerprint },
  } = useStores()

  const player = useRef(null)

  useEffect(() => {
    setTimeout(() => player.current.seek(1.2), 1000)
  }, [])

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
        repeat
        paused={false}
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
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}
