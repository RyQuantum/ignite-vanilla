import React, { Component } from "react"
import { View, ViewStyle, ImageStyle } from "react-native"
import { observer } from "mobx-react"
import { Screen } from "../../components"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStoreContext } from "../../models"
import { ListItem } from "@rneui/themed"
import DatePicker from "react-native-date-picker"

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
}

@observer
export class ChangePeriodScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    searchText: "",
    // lockList: [],
    // isLoading: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
          <ListItem topDivider bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Start Time</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>2023-03-01 15:00</ListItem.Subtitle>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>End Time</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>2023-03-01 16:00</ListItem.Subtitle>
          </ListItem>
          {/* <DateTimePicker */}
          {/*   // testID="dateTimePicker" */}
          {/*   // timeZoneOffsetInMinutes={tzOffsetInMinutes} */}
          {/*   // minuteInterval={interval} */}
          {/*   // maximumDate={maximumDate} */}
          {/*   // minimumDate={minimumDate} */}
          {/*   value={new Date()} */}
          {/*   mode="datetime" */}
          {/*   display="spinner" */}
          {/*   // display="spinner" */}
          {/*   // is24Hour */}
          {/*   // display={display} */}
          {/*   // onChange={onChange} */}
          {/*   // textColor={textColor || undefined} */}
          {/*   // accentColor={accentColor || undefined} */}
          {/*   // neutralButton={{label: neutralButtonLabel}} */}
          {/*   // negativeButton={{label: 'Cancel', textColor: 'red'}} */}
          {/*   // disabled={disabled} */}
          {/* /> */}
          <DatePicker
            modal
            open
            mode="datetime"
            date={new Date()}
            minuteInterval={60}
            // onConfirm={(date) => {
            //   setOpen(false)
            //   setDate(date)
            // }}
            // onCancel={() => {
            //   setOpen(false)
            // }}
          />
        </View>
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
