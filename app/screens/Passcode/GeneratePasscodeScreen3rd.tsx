import React, { Component } from "react"
import { View, ViewStyle, Switch, StyleSheet, Button as Button2, TextStyle } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import { ListItem, Overlay, Tab } from "@rneui/themed"
// import { ListItem, Overlay, Tab } from "react-native-elements"
import { colors } from "../../theme"
import { Text, Screen, Button } from "../../components"
import { RootStoreContext } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Spinner from "react-native-loading-spinner-overlay"
// const PlusImage = require("../../../assets/images/plus.jpeg")

type RootStackParamList = {
  // "Assign Name": { lockName: string };
}

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  // name: string
  // isLoading: boolean
  index: number
  name: string
  isPermanent: boolean
  code: string
  visible: boolean
}

@observer
export class GeneratePasscodeScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    index: 0,
    name: "",
    isPermanent: true,
    startTime: "",
    endTime: "",
    startDateTime: "",
    endDateTime: "",
    passcode: "", // custom code
    code: "", // auto code result from the server
    visible: false,
    // lockList: [],
    // isLoading: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {}

  componentWillUnmount() {}

  generatePasscode = async () => {
    let keyboardPwdType = 0
    let startDate = 0
    let endDate = 0
    let res = null
    switch (this.state.index) {
      case 0:
        keyboardPwdType = 2
        break
      case 1:
        keyboardPwdType = 3
        break
      case 2:
        keyboardPwdType = 1
        break
      case 3:
        // keyboardPwdType = 0 // CUSTOM
        if (!this.state.isPermanent) {
          // TODO date time library
        }
        res = await this.context.codeStore.addCode(this.props.route.params.lockId, this.state.passcode, this.state.name, startDate, endDate)
        if (res) this.setState({ code: this.state.passcode, visible: true })
        return
      case 4:
        keyboardPwdType = 0 // Recurring
        break
      case 5:
        keyboardPwdType = 4
        break
    }
    const { keyboardPwd } = await this.context.codeStore.generateCode(this.props.route.params.lockId, keyboardPwdType, this.state.name, Date.now()) // TODO check result
    this.setState({ code: keyboardPwd, visible: true })
  }

  render() {
    const {
      codeStore: { isLoading },
    } = this.context

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          {/* {TODO Tab indicator bug} */}
          <Tab
            value={this.state.index}
            onChange={(index) => this.setState({ index })}
            dense
            scrollable
            indicatorStyle={{ backgroundColor: "skyblue" }}
            style={{ backgroundColor: "white" }}
          >
            <Tab.Item
              titleStyle={{ color: this.state.index === 0 ? "skyblue" : colors.text }}
              title="Permanent"
            />
            <Tab.Item
              titleStyle={{ color: this.state.index === 1 ? "skyblue" : colors.text }}
              title="Timed"
            />
            <Tab.Item
              titleStyle={{ color: this.state.index === 2 ? "skyblue" : colors.text }}
              title="One-time"
            />
            <Tab.Item
              titleStyle={{ color: this.state.index === 3 ? "skyblue" : colors.text }}
              title="Custom"
            />
            <Tab.Item
              titleStyle={{ color: this.state.index === 4 ? "skyblue" : colors.text }}
              title="Recurring"
            />
            <Tab.Item
              titleStyle={{ color: this.state.index === 5 ? "skyblue" : colors.text }}
              title="Erase"
            />
          </Tab>
          {/* <ScrollableTabView */}
          {/*   style={{ marginTop: 20 }} */}
          {/*   initialPage={0} */}
          {/*   renderTabBar={() => <ScrollableTabBar />} */}
          {/* > */}
          {/*   <Text tabLabel='Tab #1'>My</Text> */}
          {/*   <Text tabLabel='Tab #2 word word'>favorite</Text> */}
          {/*   <Text tabLabel='Tab #3 word word word'>project</Text> */}
          {/*   <Text tabLabel='Tab #4 word word word word'>favorite</Text> */}
          {/*   <Text tabLabel='Tab #5'>project</Text> */}
          {/* </ScrollableTabView> */}

          <DemoDivider />

          <Overlay isVisible={this.state.visible}>
            <Icon
              style={{ alignSelf: "center" }}
              name="check-circle"
              color="limegreen"
              size={100}
            />
            <Text style={$textSecondary}>Succeeded. The Passcode is</Text>
            <Text style={$textPrimary}>{this.state.code}</Text>
            <Button
              style={{ backgroundColor: "skyblue", borderWidth: 0 }}
              textStyle={{ color: "white" }}
              onPress={() => this.setState({ visible: false, name: "" })}
            >
              Complete
            </Button>
            <DemoDivider />
            <Button
              style={{ borderColor: "skyblue" }}
              textStyle={{ color: "skyblue" }}
              onPress={() => {}}
            >
              Share
            </Button>
            {/*TODO finish share*/}
          </Overlay>

          {this.state.index === 0 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder="Enter a name for this passcode"
                  />
                </ListItem.Content>
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode MUST BE used at least Once, within 24 Hours from Current Time, or it
                will be SUSPENDED for Security Reasons.{" "}
              </Text>
            </>
          )}

          {this.state.index === 1 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Start Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>2023-03-01 23:00</ListItem.Subtitle>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Title>End Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>2023-03-01 23:00</ListItem.Subtitle>
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input placeholder="Enter a name for this passcode" />
                </ListItem.Content>
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode can be used for unlimited times within the validity period.{"\n"}This
                passcode MUST BE used at least ONCE within 24 Hours after setting, or it will be
                SUSPENDED for Security Reasons.
              </Text>
            </>
          )}

          {this.state.index === 2 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input placeholder="Enter a name for this passcode" />
                </ListItem.Content>
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode MUST BE used within 6 Hours from the Current Time or it will be
                SUSPENDED for Security Reasons. This Passcode can ONLY be used ONCE.
              </Text>
            </>
          )}

          {this.state.index === 3 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Permanent</ListItem.Title>
                <ListItem.Content />
                <Switch
                  value={this.state.isPermanent}
                  onChange={() => this.setState({ isPermanent: !this.state.isPermanent })}
                />
              </ListItem>
              {this.state.isPermanent || (
                <>
                  <ListItem bottomDivider>
                    <ListItem.Title>Start Time</ListItem.Title>
                    <ListItem.Content />
                    <ListItem.Subtitle>{this.state.startDateTime}</ListItem.Subtitle>
                  </ListItem>
                  <ListItem bottomDivider>
                    <ListItem.Title>End Time</ListItem.Title>
                    <ListItem.Content />
                    <ListItem.Subtitle>{this.state.endDateTime}</ListItem.Subtitle>
                  </ListItem>
                </>
              )}
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder="Enter a name for this passcode"
                  />
                </ListItem.Content>
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Passcode</ListItem.Title>
                <ListItem.Content />
                <ListItem.Input
                  value={this.state.passcode}
                  onChangeText={(passcode) => this.setState({ passcode })}
                  placeholder="4 - 9 Digits in length"
                  keyboardType="number-pad"
                />
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                You can Configure the Customized Passcode via Bluetooth or Remotely via a Gateway.
              </Text>
            </>
          )}

          {this.state.index === 4 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Mode</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>Weekend</ListItem.Subtitle>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Title>Start Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>23:00</ListItem.Subtitle>
              </ListItem>
              <ListItem bottomDivider>
                <ListItem.Title>End Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>23:00</ListItem.Subtitle>
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input placeholder="Enter a name for this passcode" />
                </ListItem.Content>
              </ListItem>
              <DemoDivider />
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode MUST BE used at least Once, within 24 Hours after the Start Date and
                Time or it will be SUSPENDED for Security Reasons.
              </Text>
            </>
          )}

          {this.state.index === 5 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Content>
                  <ListItem.Input placeholder="Enter a name for this passcode" />
                </ListItem.Content>
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode is VALID for 24 Hours from the Current Time.{"\n"}Caution - All
                Passcodes used on this Lock will be DELETED on using this Passcode.
              </Text>
            </>
          )}

          <Button
            preset="filled"
            style={{ margin: 20, backgroundColor: "skyblue" }}
            textStyle={{ color: "white" }}
            onPress={this.generatePasscode}
          >
            {this.state.index === 3 ? "Set Passcode" : "Generate"}
          </Button>
        </View>
        <Spinner visible={isLoading} />
      </Screen>
    )
  }
}

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}

const $textPrimary: TextStyle = {
  margin: 20,
  textAlign: "center",
  fontSize: 24,
  fontWeight: "bold",
}

const $textSecondary: TextStyle = {
  marginBottom: 10,
  textAlign: "center",
  fontSize: 17,
}
