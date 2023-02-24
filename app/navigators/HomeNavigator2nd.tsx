import React from 'react';
import { View, Text, ActivityIndicator, ViewStyle } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderButton, HeaderButtons, Item } from "react-navigation-header-buttons"
import { CustomButton, Screen } from "../components"
import { NearbyLocksScreen, TutorialScreen } from "../screens/AddingWorkflow"
import { AssignNameScreen } from "../screens/AddingWorkflow/AssignNameScreen2nd"
import { MainScreen } from "../screens/MainScreens"
import { spacing } from "../theme"

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

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sifely" component={MainScreen} />
      <Stack.Screen name="xxx Add Lock" component={TutorialScreen} />
    </Stack.Navigator>
  );
}

const MyHeaderButton = (props) => {
  return <HeaderButton IconComponent={Icon} iconSize={23} {...props} />
}

function AddingNavigator() {
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="Add Lock"
        component={TutorialScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
              <Item title="back" iconName="arrow-left" onPress={() => {
                navigation.navigate("Sifely")
                navigation.toggleDrawer()
              }} />
            </HeaderButtons>
          ),
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

function SettingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
              <Item title="back" iconName="arrow-left" onPress={() => {
                navigation.navigate("Sifely")
                navigation.toggleDrawer()
              }} />
            </HeaderButtons>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return (
    <Drawer.Navigator
      // useLegacyImplementation
      screenOptions={{ headerStyle: { backgroundColor: 'skyblue' }, headerTintColor: 'white', headerShown: false, swipeEdgeWidth: 0 }}
    >
      <Drawer.Screen name="Main" options={{ title: "Sifely", drawerItemStyle: { height: 0 }, headerShown: true }} component={MainNavigator} />
      <Drawer.Screen name="Adding" options={{ title: "Add Lock" }} component={AddingNavigator} />
      <Drawer.Screen name="Setting" options={{ title: "Settings" }} component={SettingNavigator} />
    </Drawer.Navigator>
  );
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  // justifyContent: "space-around",
  height: "100%",
}
