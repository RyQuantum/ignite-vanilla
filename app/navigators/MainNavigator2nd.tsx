import React, { useState } from "react"
import { View, Text, ActivityIndicator, ViewStyle, Alert } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicon from "react-native-vector-icons/Ionicons"
import { HeaderButton, HeaderButtons, Item } from "react-navigation-header-buttons"
import { CustomButton, Screen } from "../components"
import { spacing } from "../theme"
import { NearbyLocksScreen, TutorialScreen, AssignNameScreen } from "../screens/AddingWorkflow"
import { LocksScreen, LockHomeScreen } from "../screens/LockScreen"
import { PasscodesScreen, PasscodeInfoScreen, ChangePeriodScreen, RecordsScreen } from "../screens/Passcode"
import { GeneratePasscodeScreen } from "../screens/Passcode/GeneratePasscodeScreen3rd"
import Spinner from "react-native-loading-spinner-overlay"
import { useStores } from "../models"
import { observer } from "mobx-react"

function Settings({ navigation }) {
  return (
    <Screen
      preset="scroll"
      // safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text>Settings screen</Text>
      <CustomButton
        onPress={() =>
          navigation.navigate('Adding', {
            screen: 'Tutorial',
            params: { user: 'jane' },
          })
        }
      >
        Start adding
      </CustomButton>
    </Screen>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const LocksNavigator = observer(function (_props) {
  const {
    codeStore: { isLoading, resetAllCodes, share, lockId }, // TODO each module has an "isLoading", how to organize them?
  } = useStores()

  return (
    <>
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
      <Stack.Navigator
        screenOptions={{
          // headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "skyblue" },
        }}
      >
        <Stack.Screen
          name="My Locks"
          component={LocksScreen}
          options={({ navigation }) => ({
            title: "Sifely",
            headerLeft: () => (
              <HeaderButtons HeaderButtonComponent={HeaderBackButton}>
                <Item
                  title="back"
                  iconName="menu"
                  color="white"
                  onPress={() => {
                    navigation.toggleDrawer()
                  }}
                />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="Lock Details"
          component={LockHomeScreen}
          options={({ navigation }) => ({
            title: "Sifely",
            headerLeft: () => (
              <HeaderButtons HeaderButtonComponent={HeaderBackButton}>
                <Item
                  title="back"
                  iconName="arrow-left"
                  color="white"
                  onPress={() => {
                    navigation.navigate("My Locks")
                  }}
                />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="Passcodes"
          component={PasscodesScreen}
          options={({ navigation }) => ({
            // title: "Passcodes",
            headerRight: () => (
              <HeaderButtons>
                <Item title="Reset" buttonStyle={{ color: "white" }}
                      onPress={() => Alert.alert("ALL Passcodes for this Lock will be DELETED", undefined, [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "Reset",
                          onPress: async () => {
                            const res = await resetAllCodes(lockId)
                            // if (res) this.props.navigation.goBack()
                            // TODO call forceUpdate of the PasscodesScreen
                          },
                        },
                      ])} />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="Generate Passcode"
          component={GeneratePasscodeScreen}
          // options={({ navigation }) => ({
          //   title: "Passcodes",
          // })}
        />
        <Stack.Screen
          name="Passcode Info"
          component={PasscodeInfoScreen}
          options={({ navigation }) => ({
            // title: "Passcodes",
            headerRight: () => (
              <HeaderButtons HeaderButtonComponent={HeaderShareButton}>
                <Item title="share" iconName="share-outline" color="white" onPress={share} />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="Change Period"
          component={ChangePeriodScreen}
          options={({ navigation }) => ({
            // title: "Passcodes",
            // headerRight: () => (
            //   <HeaderButtons>
            //     <Item title="Save" buttonStyle={{ color: "white" }} onPress={async () => {
            //       const res = await updateCode(undefined, )
            //     }} />
            //   </HeaderButtons>
            // ),
          })}
        />
        <Stack.Screen
          name="Records"
          component={RecordsScreen}
          // options={({ navigation }) => ({
          //   title: "Passcodes",
          // })}
        />
      </Stack.Navigator>
    </>
  )
})

const HeaderBackButton = (props) => {
  return <HeaderButton IconComponent={Icon} iconSize={23} {...props} />
}

const HeaderShareButton = (props) => {
  return <HeaderButton IconComponent={Ionicon} iconSize={23} {...props} />
}

function AddingLockNavigator() {
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBackButton}>
              <Item title="back" iconName="arrow-left" onPress={() => {
                navigation.navigate("My Locks")
                navigation.toggleDrawer()
              }} />
            </HeaderButtons>
          )
        })}
      />
      <Stack.Screen
        name="Nearby Locks"
        component={NearbyLocksScreen}
        options={({ headerRight: () => <View style={{ padding: 24 }}><ActivityIndicator /></View> })}
      />
      <Stack.Screen
        name="Assign Name"
        component={AssignNameScreen}
        options={{ headerLeft: () => null, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBackButton}>
              <Item title="back" iconName="arrow-left" onPress={() => {
                navigation.navigate("My Locks")
                navigation.toggleDrawer()
              }} />
            </HeaderButtons>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Drawer.Navigator
      // useLegacyImplementation
      screenOptions={{ headerStyle: { backgroundColor: 'skyblue' }, headerTintColor: 'white', headerShown: false, swipeEdgeWidth: 0 }}
    >
      <Drawer.Screen name="Locks" options={{ drawerItemStyle: { height: 0 } }} component={LocksNavigator} />
      <Drawer.Screen name="Adding" options={{ title: "Add Lock" }} component={AddingLockNavigator} />
      <Drawer.Screen name="Setting" options={{ title: "Settings" }} component={SettingsNavigator} />
    </Drawer.Navigator>
  );
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  // justifyContent: "space-around",
  height: "100%",
}
