import React, { FC, useEffect, useState } from "react"
import { BackHandler, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Spinner from "react-native-loading-spinner-overlay"
import { CustomButton, Screen, Text, TextField } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"
import { useStores } from "../../models"

export const AssignNameScreen: FC<any> = observer(function AssignNameScreen(props) {

  const { lockStore: { rename, isLoading } } = useStores()
  const [lockAlias, setLockAlias] = useState(props.route.params.lockName)

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => true)
    return () => {
      handler.remove()
    }
  }, [])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
      <View>
        <Text style={$text}>Success. Assign a name</Text>
        <DemoDivider size={48} />
        <TextField
          value={lockAlias}
          onChangeText={setLockAlias}
          autoCapitalize="none"
          containerStyle={$textField}
        />
      </View>
      <DemoDivider size={24} />
      <CustomButton
        onPress={async () => {
          await rename(props.route.params.lockId, lockAlias)
          props.navigation.reset({
            index: 1,
            routes: [{ name: 'Adding' }],
          })
        }}
      >
        OK
      </CustomButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
  height: "100%",
}

const $text: TextStyle = {
  alignSelf: "center"
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}
