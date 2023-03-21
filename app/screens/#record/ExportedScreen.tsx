import React, { FC, useEffect } from "react"
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
      <View style={$container}>
        <Icon style={$icon} name="check-circle" color="limegreen" size={80} />
        <DemoDivider />
        <Text style={$text}>Exported successfully.</Text>
      </View>
      <Button style={$button} textStyle={$buttonText} onPress={() => FileViewer.open(path)}>
        View
      </Button>
      <DemoDivider />
      <Button
        style={$button2}
        textStyle={$button2Text}
        onPress={() => {
          Share.open({ url: `file://${path}` })
        }}
      >
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

const $container: ViewStyle = {
  paddingVertical: 70,
  paddingHorizontal: 50,
}

const $icon: ViewStyle = {
  alignSelf: "center",
}

const $text: TextStyle = {
  marginBottom: 10,
  textAlign: "center",
  fontSize: 17,
}

const $button: ViewStyle = {
  backgroundColor: "skyblue",
  borderWidth: 0,
}

const $buttonText: TextStyle = {
  color: "white",
}

const $button2: ViewStyle = {
  borderColor: "skyblue",
}

const $button2Text: TextStyle = {
  color: "skyblue",
}
