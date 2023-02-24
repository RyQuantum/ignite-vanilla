import React, { Component } from "react"
import { Platform, Text, View, ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { Text as Text2, Card, Screen, LockCard } from "../../components"
import { colors, spacing } from "../../theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Divider } from "@rneui/base"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

type RootStackParamList = {
  // "Assign Name": { lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  name: string
}

export class MainScreen extends Component<IProps, IState> {

  state: IState = {
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Screen
        preset="scroll"
        // safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          <LockCard />
          <Card
            HeadingComponent={
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontFamily: "SpaceGrotesk-Bold", fontSize: 18 }}>Sifely-S_3a401b</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>100%</Text>
                  <Text> </Text>
                  <Icon name="battery-full-sharp" size={20} />
                </View>
              </View>
            }
            ContentComponent={
              <>
                <Text style={{ color: colors.palette.neutral400, fontSize: 10, marginTop: 3, marginBottom: 5 }}>Remote Unlock</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ backgroundColor: 'red', color: colors.palette.neutral100, fontSize: 10, paddingHorizontal: 2 }}>Expired</Text>
                  {/* <Text style={{ fontSize: 10 }}> </Text> */}
                </View>
              </>
            }
            footer="2023.02.16 17:31 - 2023.03.17 17:31/Authorized Admin"
            footerStyle={{
              fontSize: 11,
              fontFamily: "System",
              color: colors.palette.neutral600,
              textDecorationColor: colors.error,
            }}
            style={{ shadowOpacity: 0.1 }}
          />
        </View>
      </Screen>
    )
  }
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  // justifyContent: "space-around",
  height: "100%",
}
