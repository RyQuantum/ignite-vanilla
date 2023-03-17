import React, { FC, useEffect, useRef, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Button, Screen, Text } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { spacing } from "../../theme"
import FileViewer from "react-native-file-viewer"
import Share from "react-native-share"

export const ExportedScreen: FC<any> = observer(function ExportedScreen(props) {
  const {
    recordStore: { path },
  } = useStores()

  useEffect(() => {
    props.navigation.setOptions({ title: "Records" })
  }, [])

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View style={{ paddingVertical: 70, paddingHorizontal: 50 }}>
        <Icon style={{ alignSelf: "center" }} name="check-circle" color="limegreen" size={80} />
        <DemoDivider />
        <Text style={$textSecondary}>Exported successfully.</Text>
      </View>
      <Button
        style={{ backgroundColor: "skyblue", borderWidth: 0 }}
        textStyle={{ color: "white" }}
        onPress={() => FileViewer.open(path)}
      >
        View
      </Button>
      <DemoDivider />
      <Button style={{ borderColor: "skyblue" }} textStyle={{ color: "skyblue" }} onPress={() => {
        Share.open({ url: `file://${path}` })
      }}>
        Share
      </Button>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
  height: "100%",
}


const $textPrimary: TextStyle = {
  margin: 20,
  textAlign: "center",
  fontSize: 24,
  fontWeight: "bold",
}

const $textSecondary: TextStyle = {
  marginBottom: 10,
  textAlign: "center",
  fontSize: 17,
}
