import React, { Component } from "react"
import { View, ViewStyle, ImageStyle, Text } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import { ListItem } from "@rneui/themed"
import { ListItem } from "react-native-elements"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TimePicker from "react-native-24h-timepicker";
import { Screen } from "../../components"
import { RootStoreContext } from "../../models"

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
    // setTimeout(() => this.TimePicker.open(), 1000)
    // setTimeout(() => this.setState({ visible: true }), 1000)
  }

  componentWillUnmount() {
  }

  onConfirm = (hour, minute)  => {
    this.setState({ hour });
    this.TimePicker.close();
  }

  render() {
    const {
      lockStore: { lockList, lockGroups, isLoading },
    } = this.context

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
                // date: new Date(this.props.route.params.code.startDate),
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
                // date: new Date(this.props.route.params.code.endDate),
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
        </View>
        <DateTimePickerModal
          isVisible={this.state.dateVisible}
          mode="date"
          date={this.state.date}
          onConfirm={(date) => {
            console.log("A date has been picked: ", date.toLocaleDateString("en-CA"))
            const newState = {
              dateVisible: false,
              hour: parseInt(this.state.startTime.slice(0, 2)).toString(),
            }
            if (this.state.isStart) {
              newState.startDate = date.toLocaleDateString("en-CA")
            } else {
              newState.endDate = date.toLocaleDateString("en-CA")
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
            console.log(hour)
            if (this.state.isStart) {
              this.setState({ startTime: hour.padStart(2, "0") + ":00" })
            } else {
              this.setState({ endTime: hour.padStart(2, "0") + ":00" })
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
