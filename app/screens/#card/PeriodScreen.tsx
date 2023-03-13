import React, { FC, useState } from "react"
import { ViewStyle, Text, View } from "react-native"
import { ButtonGroup, ListItem } from "@rneui/themed"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Button, Screen } from "../../components"
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
      <View style={{ backgroundColor: "white" }}>
        <Text style={{ fontSize: 16, padding: 20 }}>Cycle on</Text>
        <ButtonGroup
          buttons={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          selectMultiple
          selectedIndexes={selectedIndexes}
          onPress={setSelectedIndexes}
          containerStyle={{ marginBottom: 20 }}
          selectedButtonStyle={{ backgroundColor: "skyblue" }}
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
      <Button
        preset="filled"
        style={{ margin: 20, backgroundColor: "skyblue" }}
        textStyle={{ color: "white" }}
        onPress={this.generatePasscode}
      >
        OK
      </Button>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
  height: "100%",
}
