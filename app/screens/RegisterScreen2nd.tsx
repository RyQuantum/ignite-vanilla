import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Text, TextStyle, ViewStyle, View } from "react-native"
import { ButtonGroup } from "@rneui/themed"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal"
import {
  Icon as StyledIcon,
  Screen,
  TextField,
  Toggle,
  TextFieldAccessoryProps,
  Text as StyledText,
  CustomButton,
} from "../components"
import { colors, spacing } from "../theme"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { useStores } from "../models"

export const RegisterScreen: FC<any> = observer(function RegisterScreen(props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [country, setCountry] = useState<Country | null>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)

  const [agreed, setAgreed] = useState(false)

  const {
    authenticationStore: {
      validationErrors,
      registerEmail,
      registerPhone,
      registerPassword,
      registerConfirmPassword,
      verificationCode,
      setRegisterEmail,
      setRegisterPhone,
      setRegisterPassword,
      setRegisterConfirmPassword,
      setCode,
      sendVerificationCode,
      register,
      count,
    },
  } = useStores()


  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <StyledIcon
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
          <StyledIcon
            icon={isConfirmPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
          />
        )
      },
    [isConfirmPasswordHidden],
  )

  const isButtonDisabled = useMemo(() => {
    return (registerPassword.length === 0 || registerConfirmPassword.length === 0 || (selectedIndex === 0 ? (registerEmail.length === 0 || validationErrors.registerEmail !== "") : (registerPhone.length === 0 || validationErrors.registerPhone !== "")) || validationErrors.registerPassword !== "" || validationErrors.registerConfirmPassword !== "")
  }, [registerPassword, registerConfirmPassword, selectedIndex, registerEmail, registerPhone])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >

      <ButtonGroup
        buttons={['Email', 'Phone']}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
        }}
      />

      <DemoDivider size={24} />

      <CountryPicker
        countryCode={countryCode}
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        withEmoji
        withCallingCodeButton
        onSelect={(country: Country) => {
          setCountryCode(country.cca2)
          setCountry(country)
        }}
      />

      <DemoDivider size={24} />

      {selectedIndex === 0 ?
        <TextField
          value={registerEmail}
          onChangeText={setRegisterEmail}
          status={validationErrors.registerEmail ? "error" : undefined}
          helper={validationErrors.registerEmail || undefined}
          HelperTextProps={{ style: { color: "red" } }}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Enter your email address"
          LeftAccessory={(props) => (
            <View style={props.style}>
              <Icon name="email" size={24} color="grey"/>
            </View>
          )}
        /> :
        <TextField
          value={registerPhone}
          onChangeText={setRegisterPhone}
          status={validationErrors.registerPhone ? "error" : undefined}
          helper={validationErrors.registerPhone || undefined}
          HelperTextProps={{ style: { color: "red" } }}
          containerStyle={$textField}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          placeholder="Enter your phone number"
          LeftAccessory={(props) => (
            <View style={props.style}>
              <Icon name="phone" size={24} color="grey"/>
            </View>
          )}
        />
      }

      <TextField
        value={registerPassword}
        onChangeText={setRegisterPassword}
        status={validationErrors.registerPassword ? "error" : undefined}
        helper={validationErrors.registerPassword || undefined}
        HelperTextProps={{ style: { color: "red" } }}
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
        value={registerConfirmPassword}
        onChangeText={setRegisterConfirmPassword}
        status={validationErrors.registerConfirmPassword ? "error" : undefined}
        helper={validationErrors.registerConfirmPassword || undefined}
        HelperTextProps={{ style: { color: "red" } }}
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

      <StyledText style={$tip}>Your password must have 8-20 characters, and include a minimum of two types of numbers, letters and symbols</StyledText>

      <View style={$verificationCodeContainer}>
        <TextField
          value={verificationCode}
          onChangeText={setCode}
          containerStyle={$verificationCode}
          keyboardType="number-pad"
          placeholder="Verification code"
        />
        <CustomButton style={$getCodeButton} onPress={() => sendVerificationCode(country, selectedIndex)} disabled={isButtonDisabled || count !== -1}>{count === -1 ? "Get code" : count}</CustomButton>
      </View>

      <DemoDivider size={24} />

      <CustomButton style={$registerButton} onPress={() => register(country, selectedIndex)} disabled={isButtonDisabled || !agreed || verificationCode.length < 4}>Register</CustomButton>

      <DemoDivider size={24} />

      <View style={$checkBoxContainer}>
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

const $tip: TextStyle = {
  color: 'gray',
  fontSize: 14
}

const $verificationCodeContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}

const $verificationCode: ViewStyle = {
  width: "100%",
  maxWidth: '60%'
}

const $getCodeButton: ViewStyle = {
  width: 100,
}

const $registerButton: ViewStyle = {
  borderRadius: 30
}

const $link: TextStyle = {
  color: 'skyblue'
}

const $checkBoxContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
