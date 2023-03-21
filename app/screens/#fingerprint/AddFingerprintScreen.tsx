import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { ListItem, Tab } from "@rneui/themed"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import TimePicker from "react-native-24h-timepicker"
import { useStores } from "../../models"
import { Screen, CustomButton } from "../../components"
import { colors } from "../../theme"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

export const AddFingerprintScreen: FC<any> = observer(function AddFingerprintScreen(props) {
  const {
    fingerprintStore: { index, removeAllFingerprintParams, setIndex, setProp },
  } = useStores()

  const [name, setName] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [hour, setHour] = useState<string>(new Date().getHours().toString())
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [startTime, setStartTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 3600000).toLocaleDateString("en-CA"))
  const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 3600000).toLocaleTimeString([], { hour12: false, hour: '2-digit' }) + ":00")
  const [startDate2, setStartDate2] = useState<string>(startDate)
  const [startTime2, setStartTime2] = useState<string>(startTime)
  const [endDate2, setEndDate2] = useState<string>(endDate)
  const [endTime2, setEndTime2] = useState<string>(endTime)
  const [cycleDays2, setCycleDays2] = useState<number[]>([])
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)
  const timePicker = useRef(null)

  useEffect(() => {
    removeAllFingerprintParams()
  }, [])

  const updateDateTime = useCallback((params) => {
    setStartDate2(params.startDate)
    setStartTime2(params.startTime)
    setEndDate2(params.endDate)
    setEndTime2(params.endTime)
    setCycleDays2(params.cycleDays)
  }, [])

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
          indicatorStyle={$tabIndicator}
          style={$tab}
        >
          <Tab.Item
            titleStyle={{ color: index === 0 ? "skyblue" : colors.text }}
            title="Permanent"
          />
          <Tab.Item titleStyle={{ color: index === 1 ? "skyblue" : colors.text }} title="Timed" />
          <Tab.Item
            titleStyle={{ color: index === 2 ? "skyblue" : colors.text }}
            title="Recurring"
          />
        </Tab>

        <DemoDivider />

        <ListItem topDivider bottomDivider>
          <ListItem.Title>Name</ListItem.Title>
          <ListItem.Input value={name} onChangeText={setName} placeholder="Please enter a Name" />
        </ListItem>
        <DemoDivider />

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
              onPress={() => props.navigation.navigate("Fingerprint Validity Period", { updateDateTime, startDate2, startTime2, endDate2, endTime2, cycleDays2 })}
            >
              <ListItem.Title>Validity Period</ListItem.Title>
              <ListItem.Content />
              <ListItem.Subtitle>
                {cycleDays2.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 12 }}>{startDate2}</Text>
                    <Text style={{ fontSize: 12 }}>{endDate2}</Text>
                  </View>
                )}
              </ListItem.Subtitle>
              <ListItem.Chevron />
            </ListItem>
            {cycleDays2.length > 0 && (
              <>
                <ListItem bottomDivider>
                  <ListItem.Title>Cycle Time</ListItem.Title>
                  <ListItem.Content />
                  <ListItem.Subtitle>
                    {startTime2}-{endTime2}
                  </ListItem.Subtitle>
                </ListItem>
                <ListItem bottomDivider>
                  <ListItem.Title>Cycle on</ListItem.Title>
                  <ListItem.Content />
                  <ListItem.Subtitle>{cycleDays2.map((d) => DAYS[d]).join(", ")}</ListItem.Subtitle>
                </ListItem>
              </>
            )}
          </>
        )}

        <CustomButton
          preset="filled"
          style={$customButton}
          disabled={name === "" || (index === 2 && cycleDays2.length === 0)}
          onPress={async () => {
            setProp("fingerprintName", name)
            switch (index) {
              case 1:
                setProp("startDate", startDate)
                setProp("startTime", startTime)
                setProp("endDate", endDate)
                setProp("endTime", endTime)
                break
              case 2:
                setProp("startDate", startDate2)
                setProp("startTime", startTime2)
                setProp("endDate", endDate2)
                setProp("endTime", endTime2)
                setProp("cycleDays", cycleDays2)
                break
              default:
                console.log(`index error: index=${index}`)
            }
            props.navigation.navigate("Fingerprint Tutorial", { refreshRef: props.route.params.refreshRef })
          }}
        >
          Next
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
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: "2-digit" }) + ":00")
            }
          } else {
            setHour(parseInt(endTime.slice(0, 2)).toString())
            setEndDate(date.toLocaleDateString("en-CA"))
            const end = new Date(`${date.toLocaleDateString("en-CA")} ${endTime}`)
            if (end <= new Date(`${startDate} ${startTime}`)) {
              const start = new Date(new Date(end).setHours(end.getHours() - 1))
              setStartDate(start.toLocaleDateString("en-CA"))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: "2-digit" }) + ":00")
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

const $tabIndicator: ViewStyle = {
  backgroundColor: "skyblue",
}

const $tab: ViewStyle = {
  backgroundColor: "white",
}

const $customButton: ViewStyle = {
  margin: 20,
}
