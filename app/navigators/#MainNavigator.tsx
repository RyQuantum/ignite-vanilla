import React from "react"
import { View, Text, ActivityIndicator, ViewStyle } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesignIcon from "react-native-vector-icons/AntDesign"
import { HeaderButton, HeaderButtons, Item } from "react-navigation-header-buttons"
import Spinner from "react-native-loading-spinner-overlay"
import { observer } from "mobx-react"
import { CustomButton, Screen } from "../components"
import { spacing } from "../theme"
import { LocksScreen, LockScreen } from "../screens/#lock"
import { NearbyLocksScreen, TutorialScreen, AssignNameScreen, FAQScreen } from "../screens/#addingLock"
import {
  PasscodesScreen,
  PasscodeInfoScreen,
  ChangePeriodScreen,
  RecordsScreen as PasscodeRecordsScreen,
  GeneratePasscodeScreen,
} from "../screens/#passcode"
import {
  CardsScreen,
  AddCardScreen,
  PeriodScreen as CardPeriodScreen,
  CardInfoScreen,
  ChangePeriodScreen as CardChangePeriodScreen,
} from "../screens/#card"
import {
  FingerprintsScreen,
  AddFingerprintScreen,
  PeriodScreen as FingerprintPeriodScreen,
  FingerprintInfoScreen,
  ChangePeriodScreen as FingerprintChangePeriodScreen,
  TutorialScreen as FingerprintTutorialScreen,
  LearnFingerprintScreen,
} from "../screens/#fingerprint"
import { RecordsScreen } from "../screens/#record"

import { useStores } from "../models"

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
    lockStore: { isLoading: isLockLoading },
    codeStore: { isLoading: isCodeLoading },
    cardStore: { isLoading: isCardLoading },
    fingerprintStore: { isLoading: isFingerprintLoading },
  } = useStores()

  return (
    <>
      <Spinner visible={isCodeLoading || isLockLoading || isCardLoading || isFingerprintLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
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
          component={LockScreen}
          options={() => ({ title: "Sifely" })}
        />
        {/* Codes */}
        <Stack.Screen
          name="Passcodes"
          component={PasscodesScreen}
        />
        <Stack.Screen
          name="Generate Passcode"
          component={GeneratePasscodeScreen}
        />
        <Stack.Screen
          name="Passcode Info"
          component={PasscodeInfoScreen}
        />
        <Stack.Screen
          name="Change Period"
          component={ChangePeriodScreen}
        />
        <Stack.Screen
          name="Passcode Records"
          component={PasscodeRecordsScreen}
        />
        {/* Cards */}
        <Stack.Screen
          name="Cards"
          component={CardsScreen}
        />
        <Stack.Screen
          name="Add Card"
          component={AddCardScreen}
        />
        <Stack.Screen
          name="Validity Period"
          component={CardPeriodScreen}
        />
        <Stack.Screen
          name="Card Info"
          component={CardInfoScreen}
        />
        <Stack.Screen
          name="Card Change Period"
          component={CardChangePeriodScreen}
          options={() => ({ title: "Change Period" })}
        />
        {/* Fingerprints */}
        <Stack.Screen
          name="Fingerprints"
          component={FingerprintsScreen}
        />
        <Stack.Screen
          name="Add Fingerprint"
          component={AddFingerprintScreen}
        />
        <Stack.Screen
          name="Fingerprint Validity Period"
          component={FingerprintPeriodScreen}
        />
        <Stack.Screen
          name="Fingerprint Tutorial"
          component={FingerprintTutorialScreen}
        />
        <Stack.Screen
          name="Learn Fingerprint"
          component={LearnFingerprintScreen}
        />
        <Stack.Screen
          name="Fingerprint Info"
          component={FingerprintInfoScreen}
        />
        <Stack.Screen
          name="Fingerprint Change Period"
          component={FingerprintChangePeriodScreen}
          options={() => ({ title: "Change Period" })}
        />
        {/* Records */}
        <Stack.Screen
          name="Records"
          component={RecordsScreen}
        />
      </Stack.Navigator>
    </>
  )
})

const HeaderBackButton = (props) => {
  return <HeaderButton IconComponent={Icon} iconSize={23} {...props} />
}
const HeaderQuestionButton = (props) => {
  return <HeaderButton IconComponent={AntDesignIcon} iconSize={23} {...props} />
}

const AddingLockNavigator = observer(function AddingLockNavigator() {
  const {
    lockStore: { isLoading },
  } = useStores()

  return (
    <>
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0)" color="black" />
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: "skyblue" },
        }}
      >
        <Stack.Screen
          name="Tutorial"
          component={TutorialScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <HeaderButtons HeaderButtonComponent={HeaderBackButton}>
                <Item
                  title="back"
                  iconName="arrow-left"
                  color="white"
                  onPress={() => {
                    navigation.navigate("My Locks")
                    navigation.toggleDrawer()
                  }}
                />
              </HeaderButtons>
            ),
            headerRight: () => (
              <HeaderButtons HeaderButtonComponent={HeaderQuestionButton}>
                <Item
                  title="back"
                  iconName="questioncircleo"
                  color="white"
                  onPress={() => {
                    navigation.navigate("FAQ")
                  }}
                />
              </HeaderButtons>
            ),
          })}
        />
        <Stack.Screen
          name="Nearby Locks"
          component={NearbyLocksScreen}
          options={{
            headerRight: () => (
              <View style={{ padding: 24 }}>
                <ActivityIndicator color="white" />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Assign Name"
          component={AssignNameScreen}
          options={{ headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen name="FAQ" component={FAQScreen} />
      </Stack.Navigator>
    </>
  )
})

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

export function MainNavigator() {
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
