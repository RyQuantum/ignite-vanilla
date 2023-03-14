import React, { FC, useRef, useState } from "react"
import { Keyboard, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { ListItem, Tab } from "@rneui/themed"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"
import { useStores } from "../../models"
import { Screen, CustomButton } from "../../components"
import { colors } from "../../theme"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

export const AddCardScreen: FC<any> = observer(function AddCardScreen(props) {
  const {
    cardStore: { addCard },
  } = useStores()

  const [index, setIndex] = useState<number>(0)
  const [name, setName] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [hour, setHour] = useState<string>(new Date().getHours().toString())
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [startTime, setStartTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 3600000).toLocaleDateString("en-CA"),)
  const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 3600000).toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)
  const timePicker = useRef(null)

  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, true, true])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View>
        {/* {TODO Tab indicator bug} */}
        <Tab
          value={index}
          onChange={setIndex}
          dense
          indicatorStyle={{ backgroundColor: "skyblue" }}
          style={{ backgroundColor: "white" }}
        >
          <Tab.Item
            titleStyle={{ color: index === 0 ? "skyblue" : colors.text }}
            title="Permanent"
          />
          <Tab.Item
            titleStyle={{ color: index === 1 ? "skyblue" : colors.text }}
            title="Timed"
          />
          <Tab.Item
            titleStyle={{ color: index === 2 ? "skyblue" : colors.text }}
            title="Recurring"
          />
        </Tab>

        <DemoDivider />

        <ListItem topDivider bottomDivider>
          <ListItem.Title>Name</ListItem.Title>
          <ListItem.Input
            value={name}
            onChangeText={setName}
            placeholder="Please enter a Name"
          />
        </ListItem>
        <DemoDivider />

        {index === 0 && (
          <>

          </>
        )}

        {index === 1 && (
          <>
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
              <ListItem.Subtitle>
                {startDate} {startTime}
              </ListItem.Subtitle>
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
              <ListItem.Subtitle>
                {endDate} {endTime}
              </ListItem.Subtitle>
            </ListItem>
          </>
        )}

        {index === 2 && (
          <>
            <ListItem
              bottomDivider
              onPress={() => props.navigation.navigate("Validity Period")}
            >
              <ListItem.Title>Validity Period</ListItem.Title>
              <ListItem.Content />
              <ListItem.Subtitle>
                {startDate} {endDate}
              </ListItem.Subtitle>
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
              <ListItem.Title>Cycle Time</ListItem.Title>
              <ListItem.Content />
              <ListItem.Subtitle>
                {startTime}-{endTime}
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
              <ListItem.Title>Cycle on</ListItem.Title>
              <ListItem.Content />
              <ListItem.Subtitle>
                {DAYS.filter((d, i) => days[i]).join(", ")}
              </ListItem.Subtitle>
            </ListItem>
          </>
        )}

        <CustomButton
          preset="filled"
          style={{ margin: 20 }}
          disabled={name === ""}
          onPress={async () => {
            Keyboard.dismiss()
            let res
            if (index === 0) {
              res = await addCard(name, 0, 0)
            } else {
              res = await addCard(name, new Date(`${startDate} ${startTime}`).getTime(), new Date(`${endDate} ${endTime}`).getTime())
            }
            if (res) {
              // props.route.params.setNeedRefresh(true)
              props.route.params.refreshRef.current = true
              props.navigation.goBack()
            }
          }}
        >
          OK
        </CustomButton>
      </View>
      <DateTimePickerModal
        isVisible={dateVisible}
        mode="date"
        date={date}
        minimumDate={new Date()}
        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 3))}
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}
