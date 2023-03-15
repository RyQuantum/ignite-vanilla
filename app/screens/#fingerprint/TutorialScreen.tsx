import React, { FC, useEffect, useRef } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from "react-native-video"
import { Text, Screen, CustomButton } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"

const video = require("../../../assets/videos/tutorial.mp4")
export const TutorialScreen: FC<any> = observer(function TutorialScreen(props) {

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Fingerprint",
    })
  }, [])

  const player = useRef(null)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text style={$text}>You will be required to Place your Finger to the Sensor several times. Please follow the
        prompts...</Text>
      <DemoDivider size={28} />
      <Video
        source={video}
        ref={player}
        repeat
        style={$backgroundVideo}
      />
      <DemoDivider size={16} />
      <CustomButton onPress={() => {
        props.navigation.navigate("Learn Fingerprint", { refreshRef: props.route.params.refreshRef })
      }}>Next</CustomButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  height: "100%",
}

const $text: TextStyle = {
  padding: 20,
  textAlign: "center",
}

const $backgroundVideo: ViewStyle = {
  height: 300,
}
