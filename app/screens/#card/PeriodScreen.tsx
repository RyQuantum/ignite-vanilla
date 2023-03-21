import React, { FC, useState } from "react"
import { ViewStyle, Text, View, TextStyle } from "react-native"
import { ButtonGroup, ListItem } from "@rneui/themed"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { CustomButton, Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

export const PeriodScreen: FC<any> = observer(function PeriodScreen(props) {
  const {
    // cardStore: {},
  } = useStores()

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"),)
  const [startTime, setStartTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00",)
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 3600000).toLocaleDateString("en-CA"),)
  const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 3600000).toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [days, setDays] = useState<boolean[]>([false, false, false, false, false, false, false])
  const [value, setValue] = useState<string[]>([]);

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View style={$cycleContainer}>
        <Text style={$cycleText}>Cycle on</Text>
        <ButtonGroup
          buttons={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          selectMultiple
          selectedIndexes={selectedIndexes}
          onPress={setSelectedIndexes}
          containerStyle={$buttonGroup}
          selectedButtonStyle={$selectedButton}
        />
      </View>
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
        <ListItem.Subtitle>{startTime}</ListItem.Subtitle>
        <ListItem.Chevron />
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
        <ListItem.Subtitle>{endTime}</ListItem.Subtitle>
        <ListItem.Chevron />
      </ListItem>
      <DemoDivider />
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
        <ListItem.Subtitle>{startDate}</ListItem.Subtitle>
        <ListItem.Chevron />
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
        <ListItem.Subtitle>{endDate}</ListItem.Subtitle>
        <ListItem.Chevron />
      </ListItem>
      <CustomButton preset="filled" style={$customButton} onPress={this.generatePasscode}>
        OK
      </CustomButton>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
  height: "100%",
}

const $cycleContainer: ViewStyle = {
  backgroundColor: "white",
}

const $cycleText: TextStyle = {
  fontSize: 16,
  padding: 20,
}

const $buttonGroup: ViewStyle = {
  marginBottom: 20,
}

const $selectedButton: ViewStyle = {
  backgroundColor: "skyblue",
}

const $customButton: ViewStyle = {
  margin: 20,
}
