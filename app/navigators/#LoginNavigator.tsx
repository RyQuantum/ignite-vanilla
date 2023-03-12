/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import { NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react"
import Spinner from "react-native-loading-spinner-overlay"
import {
  LoginScreen,
  PolicyScreen,
  RegisterScreen,
  ForgetPasswordScreen,
  ResetPasswordScreen,
} from "../screens/#login"
import { DemoTabParamList } from "./DemoNavigator" // @demo remove-current-line
import { HeaderButtons, Item } from "react-navigation-header-buttons" // TODO "export default" of "export" needs consistent?
import { useStores } from "../models"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined // @demo remove-current-line
  Register: undefined
  Policy: undefined
  ForgetPassword: undefined
  ResetPassword: undefined
  Demo: NavigatorScreenParams<DemoTabParamList> // @demo remove-current-line
  // 🔥 Your screens go here
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
// const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

export const LoginNavigator = observer(function LoginNavigator() {
  // @demo remove-block-start
  const {
    authenticationStore: { isLoading },
  } = useStores()

  return (
    <>
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: "skyblue" }, headerTintColor: "white" }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={options} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Policy"
          component={PolicyScreen}
          options={{ title: "Privacy Policy" }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: "Reset Password" }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPasswordScreen}
          options={{ title: "Forget Password" }}
        />
      </Stack.Navigator>
    </>
  )
})

const options = ({ navigation }) => ({
  headerRight: () => (
    <HeaderButtons>
      <Item
        title="Register"
        buttonStyle={{ color: "white" }}
        onPress={() => navigation.navigate("Register")}
      />
    </HeaderButtons>
  ),
})

// interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}
//
// export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
//   const colorScheme = useColorScheme()
//
//   useBackButtonHandler((routeName) => exitRoutes.includes(routeName))
//
//   return (
//     <NavigationContainer
//       ref={navigationRef}
//       theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//       {...props}
//     >
//       <AppStack />
//       {/* <HomeNavigator /> */}
//     </NavigationContainer>
//   )
// })

const $registerButton = {
  color: 'white',
}
