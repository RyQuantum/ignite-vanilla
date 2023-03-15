import React, { FC, useEffect, useRef, useState } from "react"
import { ViewStyle, Text, View } from "react-native"
import { ButtonGroup, ListItem } from "@rneui/themed"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"

export const PeriodScreen: FC<any> = observer(function PeriodScreen(props) {
  const {
    fingerprintStore: { cycleDays, startDate, startTime, endDate, endTime, setCycleDays, setProp },
  } = useStores()

  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  // const [hour, setHour] = useState<string>(new Date().getHours().toString())
  const [time, setTime] = useState<string>("00:00")
  // const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  // const [startTime, setStartTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  // const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 3600000).toLocaleDateString("en-CA"),)
  // const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 3600000).toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  // const [cycleDays, setCycleDays] = useState<number[]>([])
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
      <View style={{ backgroundColor: "white" }}>
        <Text style={{ fontSize: 16, padding: 20 }}>Cycle on</Text>
        <ButtonGroup
          buttons={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          selectMultiple
          selectedIndexes={cycleDays.slice()} // without slice the UI doesn't react when clicking
          onPress={setCycleDays}
          containerStyle={{ marginBottom: 20 }}
          selectedButtonStyle={{ backgroundColor: "skyblue" }}
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
      {/* <CustomButton */}
      {/*   preset="filled" */}
      {/*   style={{ margin: 20 }} */}
      {/*   // textStyle={{ color: "white" }} */}
      {/*   disabled={cycleDays.length === 0} */}
      {/*   onPress={() => { */}
      {/*     props.route.params.updateDateTime({ startDate, endDate, startTime, endTime }) */}
      {/*     props.navigation.goBack() */}
      {/*   }} */}
      {/* > */}
      {/*   OK */}
      {/* </CustomButton> */}
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
            setProp("startDate", date.toLocaleDateString("en-CA"))
            // setStartDate(date.toLocaleDateString("en-CA"))
            const start = new Date(`${date.toLocaleDateString("en-CA")}`)
            if (start > new Date(`${endDate}`)) {
              setProp("endDate", date.toLocaleDateString("en-CA"))
              // setEndDate(date.toLocaleDateString("en-CA"))
            }
          } else {
            setProp("endDate", date.toLocaleDateString("en-CA"))
            // setEndDate(date.toLocaleDateString("en-CA"))
            const end = new Date(`${date.toLocaleDateString("en-CA")}`)
            if (end < new Date(`${startDate}`)) {
              setProp("startDate", date.toLocaleDateString("en-CA"))
              // setStartDate(date.toLocaleDateString("en-CA"))
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
              setProp("endTime", end.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
              // setEndTime(end.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
            }
            setProp("startTime", start)
            // setStartTime(start)
          } else {
            let end = `${hour.padStart(2, "0")}:${minute}`
            if (end <= startTime) {
              let start = new Date(new Date(`2000 ${end}`).setMinutes(new Date(`2000 ${end}`).getMinutes() - 1))
              if (end === "00:00") {
                start = new Date(`2000 ${start}`)
                end = "00:01"
              }
              setProp("startTime", start.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
              // setStartTime(start.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }))
            }
            setProp("endTime", end)
            // setEndTime(end)
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
