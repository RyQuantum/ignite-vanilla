import React, { FC, useEffect, useRef, useState } from "react"
import { ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from "react-native-video";
import { useStores } from "../../models"
import { Text, Screen, CustomButton } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"

const video = require("../../../assets/videos/tutorial.mp4")
export const TutorialScreen: FC<any> = observer(function TutorialScreen(props) {
  const {
    fingerprintStore: { updateFingerprint, lockId },
  } = useStores()

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Fingerprint"
    })
  }, [])

  const player = useRef(null)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      {/* <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" /> */}
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
        props.navigation.navigate("Learn Fingerprint")
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
  height: 300
}
