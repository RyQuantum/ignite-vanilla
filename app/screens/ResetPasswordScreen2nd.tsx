import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Icon as Icon2, Screen, Text as Text2, TextField, TextFieldAccessoryProps } from "../components"
import { colors, spacing } from "../theme"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"

export const ResetPasswordScreen: FC<any> = observer(function ResetPasswordScreen(_props) {

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authConfirmPassword, setAuthConfirmPassword] = useState("")

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  const [text, onChangeText] = useState("");

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon2
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  const PasswordRightAccessory2 = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon2
            icon={isConfirmPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
          />
        )
      },
    [isConfirmPasswordHidden],
  )

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
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
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="account" size={24} color="grey"/>
          </View>
        )}
      />
      <TextField
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        // label="Password"
        placeholder="Password"
        // helper={errors?.authEmail}
        // status={errors?.authEmail ? "error" : undefined}
        RightAccessory={PasswordRightAccessory}
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="key" size={24} color="grey"/>
          </View>
        )}
      />

      <TextField
        value={authConfirmPassword}
        onChangeText={setAuthConfirmPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isConfirmPasswordHidden}
        // label="Confirm password"
        placeholder="Confirm password"
        // helper={errors?.authPassword}
        // status={errors?.authPassword ? "error" : undefined}
        RightAccessory={PasswordRightAccessory2}
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="key" size={24} color="grey"/>
          </View>
        )}
      />

      <Text2 style={{ color: 'gray', fontSize: 14 }}>Your password must have 8-20 characters, and include a minimum of two types of numbers, letters and symbols</Text2>

      <View style={$textContainer}>
        <TextField
          value={text}
          onChangeText={onChangeText}
          containerStyle={{ width: "100%", maxWidth: '60%' }}
          keyboardType="number-pad"
          placeholder="Verification code"
        />
        <Button preset="filled" textStyle={{ color: 'white' }}>Get code</Button>
      </View>

      <DemoDivider size={24} />

      <Button preset="filled" style={$button} textStyle={{ color: 'white' }}>Reset Password</Button>

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
  color: 'lightblue'
}
