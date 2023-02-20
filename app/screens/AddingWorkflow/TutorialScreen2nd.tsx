import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { MyButton, Screen, Text as Text2 } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { Image, ImageStyle, ViewStyle } from "react-native"
import { spacing } from "../../theme"

const TouchImage = require("../../../assets/images/Touch.png")

export const TutorialScreen: FC<any> = observer(function TutorialScreen(props) {
  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text2 style={{ alignSelf: "center" }}>Touch any key to Activate the Keypad</Text2>
      <DemoDivider size={24} />
      <Image source={TouchImage} style={$image}  resizeMode="contain"/>
      {/* TODO Update transparent background */}
      <DemoDivider size={24} />
      <Text2 style={{ alignSelf: "center" }}>Please touch any key to Activate the Lock an put it in the PAIRING Mode. Press Next</Text2>
      <MyButton onPress={() => props.navigation.navigate("Nearby Locks")}>Next</MyButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
  height: "100%",
}

const $image: ImageStyle = {
  height: 200,
  width: "100%",
}
