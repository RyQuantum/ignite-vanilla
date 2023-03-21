import React, { FC, useEffect, useRef, useState } from "react"
import { ViewStyle, Text, View, TextStyle } from "react-native"
import { ButtonGroup, ListItem } from "@rneui/themed"
import { observer } from "mobx-react"
import { CustomButton, Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"

export const PeriodScreen: FC<any> = observer(function PeriodScreen(props) {

  const { updateDateTime, startDate2, startTime2, endDate2, endTime2, cycleDays2 } = props.route.params;

  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [time, setTime] = useState<string>("00:00")
  const [startDate, setStartDate] = useState<string>(startDate2)
  const [startTime, setStartTime] = useState<string>(startTime2)
  const [endDate, setEndDate] = useState<string>(endDate2)
  const [endTime, setEndTime] = useState<string>(endTime2)
  const [cycleDays, setCycleDays] = useState<number[]>(cycleDays2)
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)
  const timePicker = useRef(null)

  useEffect(() => {
    props.navigation.setOptions({
      title: "Validity Period"
    })
  }, [])

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
          selectedIndexes={cycleDays.slice()} // without slice the UI doesn't react when clicking
          onPress={setCycleDays}
          containerStyle={$buttonGroup}
          selectedButtonStyle={$selectedButton}
        />
      </View>
      <ListItem
        topDivider
        bottomDivider
        onPress={() => {
          setTime(startTime)
          timePicker.current.open()
          setIsStart(true)
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
          // setHour(endTime.slice(0, 2))
          setTime(endTime)
          timePicker.current.open()
          setIsStart(false)
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
          setDate(new Date(`${startDate} ${startTime}`))
          setDateVisible(true)
          setIsStart(true)
        }}
      >
        <ListItem.Title>Start Date</ListItem.Title>
        <ListItem.Content />
        <ListItem.Subtitle>{startDate}</ListItem.Subtitle>
        <ListItem.Chevron />
      </ListItem>
      <ListItem
        bottomDivider
        onPress={() => {
          setDate(new Date(`${endDate} ${endTime}`))
          setDateVisible(true)
          setIsStart(false)
        }}
      >
        <ListItem.Title>End Date</ListItem.Title>
        <ListItem.Content />
        <ListItem.Subtitle>{endDate}</ListItem.Subtitle>
        <ListItem.Chevron />
      </ListItem>
      <CustomButton
        preset="filled"
        style={$customButton}
        disabled={cycleDays.length === 0}
        onPress={async () => {
          await updateDateTime({ startDate, endDate, startTime, endTime, cycleDays })
        }}
      >
        OK
      </CustomButton>
      <DateTimePickerModal
        isVisible={dateVisible}
        mode="date"
        date={date}
        minimumDate={new Date()}
        maximumDate={new Date(new Date().setFullYear(2060))}
        onConfirm={(date) => {
          console.log("A date has been picked: ", date.toLocaleDateString("en-CA"))
          setDateVisible(false)
          if (isStart) {
            // setProp("startDate", date.toLocaleDateString("en-CA"))
            setStartDate(date.toLocaleDateString("en-CA"))
            const start = new Date(`${date.toLocaleDateString("en-CA")}`)
            if (start > new Date(`${endDate}`)) {
              // setProp("endDate", date.toLocaleDateString("en-CA"))
              setEndDate(date.toLocaleDateString("en-CA"))
            }
          } else {
            // setProp("endDate", date.toLocaleDateString("en-CA"))
            setEndDate(date.toLocaleDateString("en-CA"))
            const end = new Date(`${date.toLocaleDateString("en-CA")}`)
            if (end < new Date(`${startDate}`)) {
              // setProp("startDate", date.toLocaleDateString("en-CA"))
              setStartDate(date.toLocaleDateString("en-CA"))
            }
          }
        }}
        onCancel={() => setDateVisible(false)}
      />
      <TimePicker
        ref={timePicker}
        // minuteInterval={60}
        selectedHour={parseInt(time.slice(0, 2)).toString()}
        selectedMinute={time.slice(3, 5)}
        onConfirm={(hour, minute) => {
          timePicker.current.close()
          if (isStart) {
            let start = `${hour.padStart(2, "0")}:${minute}`
            if (start >= endTime) {
              let end = new Date(new Date(`2000 ${start}`).setMinutes(new Date(`2000 ${start}`).getMinutes() + 1))
              if (start === "23:59") {
                end = new Date(`2000 ${start}`)
                start = "23:58"
              }
              // setProp("endTime", end.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
            }
            // setProp("startTime", start)
            setStartTime(start)
          } else {
            let end = `${hour.padStart(2, "0")}:${minute}`
            if (end <= startTime) {
              let start = new Date(new Date(`2000 ${end}`).setMinutes(new Date(`2000 ${end}`).getMinutes() - 1))
              if (end === "00:00") {
                start = new Date(`2000 ${start}`)
                end = "00:01"
              }
              // setProp("startTime", start.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
            }
            // setProp("endTime", end)
            setEndTime(end)
          }
        }}
        onCancel={() => timePicker.current.close()}
      />
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
