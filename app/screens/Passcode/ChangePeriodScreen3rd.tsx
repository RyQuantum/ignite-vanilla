import React, { Component } from "react"
import { View, ViewStyle, ImageStyle } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import { ListItem } from "@rneui/themed"
import { ListItem } from "react-native-elements"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import TimePicker from "react-native-24h-timepicker";
import { Screen } from "../../components"
import { RootStoreContext } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

type RootStackParamList = {
  // "Assign Name": { lockName: string };
}

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  // name: string
  // isLoading: boolean
}

@observer
export class ChangePeriodScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  declare context: React.ContextType<typeof RootStoreContext>
  state: IState = {
    date: new Date(), // for datetime modal picker
    hour: "0",
    startDate: new Date(this.props.route.params.code.startDate).toLocaleDateString("en-CA"),
    startTime: new Date(this.props.route.params.code.startDate).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }),
    endDate: new Date(this.props.route.params.code.endDate).toLocaleDateString("en-CA"),
    endTime: new Date(this.props.route.params.code.endDate).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit' }),
    dateVisible: false,
    timeVisible: false,
    isStart: false,
  }

  componentDidMount = () => {
    this.props.navigation.setOptions({ // TODO apply setOptions for all header buttons
      headerRight: () => (
        <HeaderButtons>
          <Item title="Save" buttonStyle={{ color: "white" }} onPress={async () => {
            const code = this.props.route.params.code
            const startDate = new Date(`${this.state.startDate} ${this.state.startTime}`)
            const endDate = new Date(`${this.state.endDate} ${this.state.endTime}`)
            const res = await this.context.codeStore.updateCode(code.keyboardPwdId, code.keyboardPwd, undefined, startDate.getTime(), endDate.getTime())
            if (res) this.props.navigation.goBack()
          }} />
        </HeaderButtons>
      ),
    })
  }

  componentWillUnmount() {}

  render() {

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
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
            <ListItem.Content>
              <ListItem.Title>Start Time</ListItem.Title>
            </ListItem.Content>
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
            <ListItem.Content>
              <ListItem.Title>End Time</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>
              {this.state.endDate} {this.state.endTime}
            </ListItem.Subtitle>
          </ListItem>
          <DemoDivider size={50} />
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
              setTimeout(() => this.TimePicker.open(), 300)
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
            this.TimePicker.close();
          }}
          onCancel={() => this.TimePicker.close()}
        />
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

const $iconStyle: ImageStyle = { width: 30, height: 30 }
