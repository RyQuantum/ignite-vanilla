import React, { FC, useRef, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { ListItem } from "@rneui/themed"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Button, Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"

export const ChangePeriodScreen: FC<any> = observer(function ChangePeriodScreen(props) {
  const {
    cardStore: { updateCard },
  } = useStores()

  const startDateObj = props.route.params.card.startDate === 0 ? new Date() : new Date(props.route.params.card.startDate)
  const endDateObj = props.route.params.card.endDate === 0 ? new Date(Date.now() + 3600000) : new Date(props.route.params.card.endDate)

  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [hour, setHour] = useState<string>(new Date().getHours().toString())
  const [startDate, setStartDate] = useState<string>(startDateObj.toLocaleDateString("en-CA"))
  const [startTime, setStartTime] = useState<string>(startDateObj.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [endDate, setEndDate] = useState<string>(endDateObj.toLocaleDateString("en-CA"),)
  const [endTime, setEndTime] = useState<string>(endDateObj.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)
  const timePicker = useRef(null)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
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
        <ListItem.Title>Start Time</ListItem.Title>
        <ListItem.Content />
        <ListItem.Subtitle>{startDate} {startTime}</ListItem.Subtitle>
      </ListItem>
      <ListItem
        bottomDivider
        onPress={() => {
          setDate(new Date(`${endDate} ${endTime}`))
          setDateVisible(true)
          setIsStart(false)
        }}
      >
        <ListItem.Title>End Time</ListItem.Title>
        <ListItem.Content />
        <ListItem.Subtitle>{endDate} {endTime}</ListItem.Subtitle>
      </ListItem>
      <Button
        preset="filled"
        style={$button}
        textStyle={$buttonText}
        onPress={async () => {
          const res = await updateCard(new Date(`${startDate} ${startTime}`).getTime(), new Date(`${endDate} ${endTime}`).getTime())
          if (res) props.navigation.goBack()
        }}
      >
        Save
      </Button>
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
            setHour(parseInt(startTime.slice(0, 2)).toString())
            setStartDate(date.toLocaleDateString("en-CA"))
            const start = new Date(`${date.toLocaleDateString("en-CA")} ${startTime}`)
            if (start >= new Date(`${endDate} ${endTime}`)) {
              const end = new Date(new Date(date).setHours(date.getHours() + 1))
              setEndDate(end.toLocaleDateString("en-CA"))
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
            }
          } else {
            setHour(parseInt(endTime.slice(0, 2)).toString())
            setEndDate(date.toLocaleDateString("en-CA"))
            const end = new Date(`${date.toLocaleDateString("en-CA")} ${endTime}`)
            if (end <= new Date(`${startDate} ${startTime}`)) {
              const start = new Date(new Date(end).setHours(end.getHours() - 1))
              setStartDate(start.toLocaleDateString("en-CA"))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
            }
          }
          setTimeout(() => timePicker.current.open(), 500)
        }}
        onCancel={() => setDateVisible(false)}
      />
      <TimePicker
        ref={timePicker}
        minuteInterval={60}
        selectedHour={hour}
        onConfirm={(hour, minute) => {
          if (isStart) {
            setStartTime(hour.padStart(2, "0") + ":00")
            const start = new Date(`${startDate} ${hour.padStart(2, "0") + ":00"}`)
            if (start >= new Date(`${endDate} ${endTime}`)) {
              const end = new Date(new Date(start).setHours(start.getHours() + 1))
              setEndDate(end.toLocaleDateString("en-CA"))
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: "2-digit" }) + ":00")
            }
          } else {
            setEndTime(hour.padStart(2, "0") + ":00")
            const end = new Date(`${endDate} ${hour.padStart(2, "0") + ":00"}`)
            if (end <= new Date(`${startDate} ${startTime}`)) {
              const start = new Date(new Date(end).setHours(end.getHours() - 1))
              setStartDate(start.toLocaleDateString("en-CA"))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: "2-digit" }) + ":00")
            }
          }
          timePicker.current.close()
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

const $button: ViewStyle = { margin: 20, backgroundColor: "skyblue" }

const $buttonText: TextStyle = {
  color: "white",
}
