import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon as Icon2, Screen, TextField, Toggle, TextFieldAccessoryProps, MyButton } from "../components"
import { Image, ImageStyle, TextInput, Text, TextStyle, ViewStyle, View } from "react-native"
import { colors, spacing } from "../theme"
import { useStores } from "../models"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import Spinner from "react-native-loading-spinner-overlay"

const reactNativeRadioLogo = require("../../assets/images/logo2nd.png")
// TODO use correct logo image

export const LoginScreen: FC<any> = observer(function LoginScreen(props) {
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [agreed, setAgreed] = useState(false)

  const {
    authenticationStore: {
      authEmail,
      authPassword,
      setAuthEmail,
      setAuthPassword,
      // setAuthToken,
      // validationErrors,
      isLoading,
      login,
    },
  } = useStores()

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

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />

      <Image source={reactNativeRadioLogo} style={$logo}  resizeMode="contain"/>

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        label="Username"
        placeholder="Phone number or email"
        // helper={errors?.authEmail}
        // status={errors?.authEmail ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="account" size={24}/>
          </View>
        )}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        label="Password"
        placeholder="Password"
        // helper={errors?.authPassword}
        // status={errors?.authPassword ? "error" : undefined}
        onSubmitEditing={agreed ? login : () => null}
        RightAccessory={PasswordRightAccessory}
        LeftAccessory={(props) => (
          <View style={props.style}>
            <Icon name="key" size={24}/>
          </View>
        )}
      />

      <View style={$textContainer}>
        <Toggle
          variant="checkbox"
          value={agreed}
          onPress={() => setAgreed(!agreed)}
        />
        <Text onPress={() => setAgreed(!agreed)}>  I've read and agreed </Text>
        <Text style={$link} onPress={() => props.navigation.navigate("Policy")}>
          <Text>User Terms Privacy Policy</Text>
        </Text>
      </View>

      <DemoDivider size={24} />

      <MyButton style={$button} disabled={!agreed} onPress={login}>Login</MyButton>

      <DemoDivider size={24} />

      <Text style={$link} onPress={() => props.navigation.navigate("ResetPassword")}>Forgot Password?</Text>

    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $logo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.huge,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $textContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
}

const $link: TextStyle = {
  color: 'lightblue'
}

const $button: ViewStyle = {
  borderRadius: 30
}
