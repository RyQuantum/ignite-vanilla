import React, { Component } from "react"
import { View, ViewStyle, Switch, TextStyle } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import { ListItem, Overlay, Tab } from "@rneui/themed"
// import { ListItem, Overlay, Tab } from "react-native-elements"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"
import { colors } from "../../theme"
import { Text, Screen, Button } from "../../components"
import { RootStoreContext } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ModalSelector from "react-native-modal-selector"
import Share from "react-native-share"
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
  declare context: React.ContextType<typeof RootStoreContext>
  state: IState = {
    index: 0,
    name: "",
    isPermanent: true,
    date: new Date(), // for datetime modal picker
    hour: new Date().getHours().toString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    startTime: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00",
    endDate: new Date(Date.now() + 3600000).toLocaleDateString("en-CA"),
    endTime: new Date(Date.now() + 3600000).toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00",
    dateVisible: false,
    isStart: false,
    mode: 5, // the default keyboardPwdType for recurring code
    passcode: "", // custom code
    code: "", // auto code result from the server
    visible: false,
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
        startDate = new Date(`${this.state.startDate} ${this.state.startTime}`).getTime()
        endDate = new Date(`${this.state.endDate} ${this.state.endTime}`).getTime()
        res = await this.context.codeStore.generateCode(this.props.route.params.lockId, keyboardPwdType, this.state.name, startDate, endDate)
        if (res) this.setState({ code: res.keyboardPwd, visible: true })
        return
      case 2:
        keyboardPwdType = 1
        break
      case 3:
        // keyboardPwdType = 0 // CUSTOM
        if (!this.state.isPermanent) {
          startDate = new Date(`${this.state.startDate} ${this.state.startTime}`).getTime()
          endDate = new Date(`${this.state.endDate} ${this.state.endTime}`).getTime()
          res = await this.context.codeStore.addCode(this.props.route.params.lockId, this.state.passcode, this.state.name, startDate, endDate)
        } else {
          res = await this.context.codeStore.addCode(this.props.route.params.lockId, this.state.passcode, this.state.name, startDate, endDate)
        }
        if (res) this.setState({ code: this.state.passcode, visible: true })
        return
      case 4:
        keyboardPwdType = this.state.mode
        startDate = new Date(`${new Date().toLocaleDateString("en-CA")} ${this.state.startTime}`).getTime()
        endDate = new Date(`${new Date().toLocaleDateString("en-CA")} ${this.state.endTime}`).getTime()
        res = await this.context.codeStore.generateCode(this.props.route.params.lockId, keyboardPwdType, this.state.name, startDate, endDate)
        if (res) this.setState({ code: res.keyboardPwd, visible: true })
        return
      case 5:
        keyboardPwdType = 4
        break
    }
    const { keyboardPwd } = await this.context.codeStore.generateCode(this.props.route.params.lockId, keyboardPwdType, this.state.name, Date.now()) // TODO check result
    this.setState({ code: keyboardPwd, visible: true })
  }

  render() {
    const {
      codeStore: { isLoading }, lockStore: { getLockInfo }
    } = this.context

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
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
            onPress={() => {
              this.props.route.params.needRefresh()
              this.setState({ visible: false, name: "" })
            }}
          >
            Complete
          </Button>
          <DemoDivider />
          <Button
            style={{ borderColor: "skyblue" }}
            textStyle={{ color: "skyblue" }}
            onPress={async () => {
              let type = ""
              const lock = getLockInfo(this.props.route.params.lockId)
              let startDate = new Date()
              let startString = `${startDate.toLocaleDateString("en-CA")} ${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
              let beforeDate = new Date()
              let beforeString = ""
              switch (this.state.index) {
                case 0:
                  type = "Permanent"
                  beforeDate.setDate(beforeDate.getDate() + 1)
                  beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  break
                case 1:
                  type = "Timed"
                  startString = `${this.state.startDate} ${this.state.startTime} End time: ${this.state.endDate} ${this.state.endTime}`
                  beforeDate = new Date(`${this.state.startDate} ${this.state.startTime}`)
                  beforeDate.setDate(beforeDate.getDate() + 1)
                  beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  break
                case 2:
                  type = "One-time"
                  beforeDate.setHours(beforeDate.getHours() + 6)
                  beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  break
                case 3:
                  if (this.state.isPermanent) {
                    type = "Permanent"
                    startDate = new Date(0)
                    startString = `${startDate.toLocaleDateString("en-CA")} ${startDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  } else {
                    type = "Timed"
                    startString = `${this.state.startDate} ${this.state.startTime} End time: ${this.state.endDate} ${this.state.endTime}`
                  }
                  break
                case 4:
                  type = data.find(item => item.key === this.state.mode).label + " Recurring"
                  startString = `${this.state.startTime} End time: ${this.state.endTime}`
                  beforeDate.setDate(beforeDate.getDate() + 1)
                  beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  break
                case 5:
                  type = "Erase"
                  beforeDate.setDate(beforeDate.getDate() + 1)
                  beforeString = `The Pin Code should be used at least ONCE before ${beforeDate.toLocaleDateString("en-CA")} ${beforeDate.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" }`
                  break
                default:
                  type = `invalid index: ${this.state.index}`
              }

              const message = `Hello, Here is your Pin Code: ${this.state.code}\nStart time: ${startString}\nType: ${type}\nLock name: ${lock.lockName}\n\nTo Unlock - Press PIN CODE #\n\nNotes: ${beforeString} The # key is the UNLOCKING key at the bottom right. Please don't share your Pin Code with anyone.`
              const res = await Share.open({ message }) // TODO verify the message in different code type
            }}
          >
            Share
          </Button>
        </Overlay>

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

          {this.state.index === 0 && (
            <>
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
              </ListItem>
              <Text size="xs" style={{ padding: 10, color: colors.palette.neutral500 }}>
                This passcode MUST BE used at least Once, within 24 Hours from Current Time, or it
                will be SUSPENDED for Security Reasons.{" "}
              </Text>
            </>
          )}

          {this.state.index === 1 && (
            <>
              <ListItem
                topDivider
                bottomDivider
                onPress={() => {
                  this.setState({
                    date: new Date(`${this.state.startDate} ${this.state.startTime}`),
                    dateVisible: true,
                    isStart: true,
                  })
                }}
              >
                <ListItem.Title>Start Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>
                  {this.state.startDate} {this.state.startTime}
                </ListItem.Subtitle>
              </ListItem>
              <ListItem
                bottomDivider
                onPress={() => {
                  this.setState({
                    date: new Date(`${this.state.endDate} ${this.state.endTime}`),
                    dateVisible: true,
                    isStart: false,
                  })
                }}
              >
                <ListItem.Title>End Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>
                  {this.state.endDate} {this.state.endTime}
                </ListItem.Subtitle>
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
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
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
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
                  <ListItem
                    bottomDivider
                    onPress={() => {
                      this.setState({
                        date: new Date(`${this.state.startDate} ${this.state.startTime}`),
                        dateVisible: true,
                        isStart: true,
                      })
                    }}
                  >
                    <ListItem.Title>Start Time</ListItem.Title>
                    <ListItem.Content />
                    <ListItem.Subtitle>
                      {this.state.startDate} {this.state.startTime}
                    </ListItem.Subtitle>
                  </ListItem>
                  <ListItem
                    bottomDivider
                    onPress={() => {
                      this.setState({
                        date: new Date(`${this.state.endDate} ${this.state.endTime}`),
                        dateVisible: true,
                        isStart: false,
                      })
                    }}
                  >
                    <ListItem.Title>End Time</ListItem.Title>
                    <ListItem.Content />
                    <ListItem.Subtitle>
                      {this.state.endDate} {this.state.endTime}
                    </ListItem.Subtitle>
                  </ListItem>
                </>
              )}
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Passcode</ListItem.Title>
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
                <ListItem.Subtitle>
                  <ModalSelector
                    data={data}
                    animationType="fade"
                    selectedKey={this.state.mode}
                    onChange={(option) => this.setState({ mode: option.key || this.state.mode })} // to fix variable undefined
                  />
                </ListItem.Subtitle>
              </ListItem>
              <ListItem
                bottomDivider
                onPress={() => {
                  this.setState({
                    isStart: true,
                    hour: parseInt(this.state.startTime.slice(0, 2)).toString(),
                  })
                  this.TimePicker.open()
                }}
              >
                <ListItem.Title>Start Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>{this.state.startTime}</ListItem.Subtitle>
              </ListItem>
              <ListItem
                bottomDivider
                onPress={() => {
                  this.setState({
                    isStart: false,
                    hour: parseInt(this.state.endTime.slice(0, 2)).toString(),
                  })
                  this.TimePicker.open()
                }}
              >
                <ListItem.Title>End Time</ListItem.Title>
                <ListItem.Content />
                <ListItem.Subtitle>{this.state.endTime}</ListItem.Subtitle>
              </ListItem>
              <DemoDivider />
              <ListItem topDivider bottomDivider>
                <ListItem.Title>Name</ListItem.Title>
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
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
                <ListItem.Input
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                  placeholder="Enter a name for this passcode"
                />
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
        <DateTimePickerModal
          isVisible={this.state.dateVisible}
          mode="date"
          date={this.state.date}
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 3))}
          onConfirm={(date) => {
            console.log("A date has been picked: ", date.toLocaleDateString("en-CA"))
            const newState = { dateVisible: false }
            if (this.state.isStart) {
              newState.hour = parseInt(this.state.startTime.slice(0, 2)).toString()
              newState.startDate = date.toLocaleDateString("en-CA")
              const start = new Date(`${date.toLocaleDateString("en-CA")} ${this.state.startTime}`)
              if (start >= new Date(`${this.state.endDate} ${this.state.endTime}`)) {
                const end = new Date(new Date(date).setHours(date.getHours() + 1))
                newState.endDate = end.toLocaleDateString("en-CA")
                newState.endTime = end.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"
              }
            } else {
              newState.hour = parseInt(this.state.endTime.slice(0, 2)).toString()
              newState.endDate = date.toLocaleDateString("en-CA")
              const end = new Date(`${date.toLocaleDateString("en-CA")} ${this.state.endTime}`)
              if (end <= new Date(`${this.state.startDate} ${this.state.startTime}`)) {
                const start = new Date(new Date(end).setHours(end.getHours() - 1))
                newState.startDate = start.toLocaleDateString("en-CA")
                newState.startTime = start.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00"              }
            }
            this.setState(newState, () => {
              setTimeout(() => this.TimePicker.open(), 500)
            })
          }}
          onCancel={() => this.setState({ dateVisible: false })}
        />
        <TimePicker
          ref={(ref) => (this.TimePicker = ref)}
          minuteInterval={60}
          selectedHour={this.state.hour}
          onConfirm={(hour, minute) => {
            if (this.state.isStart) {
              this.setState({ startTime: hour.padStart(2, "0") + ":00" })
              const start = new Date(`${this.state.startDate} ${hour.padStart(2, "0") + ":00"}`)
              if (start >= new Date(`${this.state.endDate} ${this.state.endTime}`)) {
                const end = new Date(new Date(start).setHours(start.getHours() + 1))
                this.setState({ endDate: end.toLocaleDateString("en-CA"), endTime: end.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" })
              }
            } else {
              this.setState({ endTime: hour.padStart(2, "0") + ":00" })
              const end = new Date(`${this.state.endDate} ${hour.padStart(2, "0") + ":00"}`)
              if (end <= new Date(`${this.state.startDate} ${this.state.startTime}`)) {
                const start = new Date(new Date(end).setHours(end.getHours() - 1))
                this.setState({ startDate: start.toLocaleDateString("en-CA"), startTime: start.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00" })
              }
            }
            this.TimePicker.close()
          }}
          onCancel={() => this.TimePicker.close()}
        />
      </Screen>
    )
  }
}

const data = [
  { key: 5, label: 'Weekend' },
  { key: 6, label: 'Daily' },
  { key: 7, label: 'Workday' },
  { key: 8, label: 'Monday' },
  { key: 9, label: 'Tuesday' },
  { key: 10, label: 'Wednesday' },
  { key: 11, label: 'Thursday' },
  { key: 12, label: 'Friday' },
  { key: 13, label: 'Saturday' },
  { key: 14, label: 'Sunday' },
];

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
