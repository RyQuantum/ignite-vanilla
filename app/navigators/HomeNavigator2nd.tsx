import React from 'react';
import { View, Text, ActivityIndicator } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from "../components"
import { NearbyLocksScreen, TutorialScreen } from "../screens/AddingWorkflow"
import { AssignNameScreen } from "../screens/AddingWorkflow/AssignNameScreen2nd"

function Settings({ navigation }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Start adding"
        onPress={() =>
          navigation.navigate('Adding', {
            screen: 'Tutorial',
            params: { user: 'jane' },
          })
        }
      />
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AddingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: "" }}>
      <Stack.Screen name="Add Lock" component={TutorialScreen} />
      {/* <Stack.Screen name="Add Lock" component={RegisterScreen} /> */}
      <Stack.Screen name="Nearby Locks" component={NearbyLocksScreen} options={({ headerRight: () => <View style={{ padding: 24 }}><ActivityIndicator /></View>})} />
      <Stack.Screen name="Assign Name" component={AssignNameScreen} options={{ headerLeft: () => null, gestureEnabled: false }} />
    </Stack.Navigator>
  );
}

function SettingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Adding"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Adding" options={{ title: "Add Lock" }} component={AddingNavigator} />
      <Drawer.Screen name="Setting" options={{ title: "Settings" }} component={SettingNavigator} />
    </Drawer.Navigator>
  );
}
