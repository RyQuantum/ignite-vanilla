import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { CustomButton, Screen, Text as StyledText } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { Image, ImageStyle, TextStyle, ViewStyle } from "react-native"
import { spacing } from "../../theme"

const TouchImage = require("../../../assets/images/Touch.png")

export const TutorialScreen: FC<any> = observer(function TutorialScreen(props) {
  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <StyledText style={$Text}>Touch any key to Activate the Keypad</StyledText>
      <DemoDivider size={24} />
      <Image source={TouchImage} style={$image}  resizeMode="contain"/>
      {/* TODO Update transparent background */}
      <DemoDivider size={24} />
      <StyledText style={$Text}>Please touch any key to Activate the Lock an put it in the PAIRING Mode. Press Next</StyledText>
      <CustomButton onPress={() => props.navigation.navigate("Nearby Locks")}>Next</CustomButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
  height: "100%",
}

const $Text: TextStyle = {
  alignSelf: "center"
}

const $image: ImageStyle = {
  height: 200,
  width: "100%",
}
