import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon as Icon2, Screen, TextField, Toggle, TextFieldAccessoryProps, CustomButton } from "../../components"
import { Image, ImageStyle, TextInput, Text, TextStyle, ViewStyle, View } from "react-native"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

const reactNativeRadioLogo = require("../../../assets/images/logo2nd.png")
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

      <CustomButton style={$button} disabled={!agreed || authPassword.length < 8 || authEmail.length < 6} onPress={login}>Login</CustomButton>

      <DemoDivider size={24} />

      <Text style={$link} onPress={() => props.navigation.navigate("ForgetPassword")}>Forgot Password?</Text>

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
  color: 'skyblue'
}

const $button: ViewStyle = {
  borderRadius: 30
}
