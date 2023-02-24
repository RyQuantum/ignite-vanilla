import React, { FC, useMemo, useState } from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Icon as Icon2, Screen, Text as Text2, TextField, TextFieldAccessoryProps } from "../components"
import { colors, spacing } from "../theme"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"

export const ForgetPasswordScreen: FC<any> = observer(function ForgetPasswordScreen(_props) {

  const [authEmail, setAuthEmail] = useState("")
  const [text, onChangeText] = useState("");

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text2 style={{ color: 'gray', fontSize: 14 }}>You can input you email address or phone number to get the verification code to login.</Text2>

      <DemoDivider size={24} />

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        // label="Phone"
        placeholder="Phone number or email"
        // helper={errors?.authEmail}
        // status={errors?.authEmail ? "error" : undefined}
        LeftAccessory={(props) => {
          return <View style={props.style}>
            <Icon name="account" size={24} color="grey"/>
          </View>
        }}
      />


      <View style={$textContainer}>
        <TextField
          value={text}
          onChangeText={onChangeText}
          containerStyle={{ width: "100%", maxWidth: '60%' }}
          keyboardType="number-pad"
          placeholder="Verification code"
        />
        <Button preset="filled" style={{ width: 100 }} textStyle={{ color: 'white' }}>Get code</Button>
      </View>

      <DemoDivider size={24} />

      <Button preset="filled" style={$button} textStyle={{ color: 'white' }}>Login</Button>

      <DemoDivider size={24} />

      <Text style={$link} onPress={() => _props.navigation.navigate("ResetPassword")}>Reset Password</Text>

    </Screen>
  )
})


const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $textContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}

const $button: ViewStyle = {
  borderRadius: 30
}

const $link: TextStyle = {
  color: 'skyblue'
}
