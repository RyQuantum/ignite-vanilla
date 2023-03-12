import React, { FC, useMemo, useState } from "react"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { Button, Icon as Icon2, Screen, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { colors, spacing } from "../../theme"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

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
        placeholder="Phone number or email"
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
        placeholder="Password"
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
        placeholder="Confirm password"
        RightAccessory={PasswordRightAccessory2}
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="key" size={24} color="grey"/>
          </View>
        )}
      />

      <Text style={{ color: 'gray', fontSize: 14 }}>Your password must have 8-20 characters, and include a minimum of two types of numbers, letters and symbols</Text>

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
