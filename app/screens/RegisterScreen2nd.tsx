import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Text, TextStyle, ViewStyle, View } from "react-native"
import { ButtonGroup } from "@rneui/themed"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal"
import { Button, Icon as Icon2, Screen, TextField, Toggle, TextFieldAccessoryProps, Text as Text2 } from "../components"
import { colors, spacing } from "../theme"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"

export const RegisterScreen: FC<any> = observer(function RegisterScreen(_props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [_country, setCountry] = useState<Country | null>(null) // TODO if it's null => US
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const [authEmail, setAuthEmail] = useState("")
  const [authPhone, setAuthPhone] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authConfirmPassword, setAuthConfirmPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  // const [value, setValue] = useState(false)
  const [text, onChangeText] = useState("");
  const [value, setValue] = useState(false)

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
        onSelect={onSelect}
      />

      <DemoDivider size={24} />

      {selectedIndex === 0 ?
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          // label="Email"
          placeholder="Enter your email address"
          // helper={errors?.authEmail}
          // status={errors?.authEmail ? "error" : undefined}
          LeftAccessory={(props) => (
            <View style={props.style}>
              <Icon name="email" size={24} color="grey"/>
            </View>
          )}
        /> :
        <TextField
          value={authPhone}
          onChangeText={setAuthPhone}
          containerStyle={$textField}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          // label="Phone"
          placeholder="Enter your phone number"
          // helper={errors?.authEmail}
          // status={errors?.authEmail ? "error" : undefined}
          LeftAccessory={(props) => (
            <View style={props.style}>
              <Icon name="phone" size={24} color="grey"/>
            </View>
          )}
        />
      }

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

      <Button preset="filled" style={$button} textStyle={{ color: 'white' }}>Register</Button>

      <DemoDivider size={24} />

      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        <Toggle
          variant="checkbox"
          value={value}
          onPress={() => setValue(!value)}
        />
        <Text onPress={() => setValue(!value)}>  I've read and agreed </Text>
        <Text style={$link} onPress={() => _props.navigation.navigate("Policy")}>
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
