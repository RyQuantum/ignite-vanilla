import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"
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
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [startTime, setStartTime] = useState<string>(new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
  const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 60000).toLocaleDateString("en-CA"))
  const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 60000).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
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
    props.navigation.goBack()
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
            titleStyle={index === 0 ? $tabTitleHighlight : $tabTitle}
            title="Permanent"
          />
          <Tab.Item titleStyle={index === 1 ? $tabTitleHighlight : $tabTitle} title="Timed" />
          <Tab.Item
            titleStyle={index === 2 ? $tabTitleHighlight : $tabTitle}
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
                    <Text style={$smallText}>{startDate2}</Text>
                    <Text style={$smallText}>{endDate2}</Text>
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
            setTime(startTime)
            setStartDate(date.toLocaleDateString("en-CA"))
            const start = new Date(`${date.toLocaleDateString("en-CA")} ${startTime}`)
            if (start >= new Date(`${endDate} ${endTime}`)) {
              const end = new Date(new Date(start).setMinutes(start.getMinutes() + 1))
              setEndDate(end.toLocaleDateString("en-CA"))
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
            }
          } else {
            setTime(endTime)
            setEndDate(date.toLocaleDateString("en-CA"))
            const end = new Date(`${date.toLocaleDateString("en-CA")} ${endTime}`)
            if (end <= new Date(`${startDate} ${startTime}`)) {
              const start = new Date(new Date(end).setMinutes(end.getMinutes() - 1))
              setStartDate(start.toLocaleDateString("en-CA"))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
            }
          }
          setTimeout(() => timePicker.current.open(), 500)
        }}
        onCancel={() => setDateVisible(false)}
      />
      <TimePicker
        ref={timePicker}
        selectedHour={parseInt(time.slice(0, 2)).toString()}
        selectedMinute={time.slice(-2)}
        onConfirm={(hour, minute) => {
          timePicker.current.close()
          if (isStart) {
            setStartTime(`${hour.padStart(2, "0")}:${minute}`)
            const start = new Date(`${startDate} ${hour.padStart(2, "0")}:${minute}`)
            if (start >= new Date(`${endDate} ${endTime}`)) {
              const end = new Date(new Date(start).setMinutes(start.getMinutes() + 1))
              setEndDate(end.toLocaleDateString("en-CA"))
              setEndTime(end.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
            }
          } else {
            setEndTime(`${hour.padStart(2, "0")}:${minute}`)
            const end = new Date(`${endDate} ${hour.padStart(2, "0")}:${minute}`)
            if (end <= new Date(`${startDate} ${startTime}`)) {
              const start = new Date(new Date(end).setMinutes(end.getMinutes() - 1))
              setStartDate(start.toLocaleDateString("en-CA"))
              setStartTime(start.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }))
            }
          }
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

const $tabTitleHighlight: TextStyle = {
  color: "skyblue",
}

const $tabTitle: TextStyle = {
  color: colors.text,
}

const $smallText: TextStyle = {
  fontSize: 12,
}

const $customButton: ViewStyle = {
  margin: 20,
}
