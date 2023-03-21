import React, { FC, useCallback, useEffect } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Text, TextStyle, View, ViewStyle } from "react-native"
import { ListItem } from "react-native-elements"
import { fire } from "react-native-alertbox"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import moment from "moment-timezone"
import { Screen } from "../../components"
import { convertTimeStampToDate } from "../../utils/ttlock2nd"

export const FingerprintInfoScreen: FC<any> = observer(function FingerprintInfoScreen(props) {

  const {
    fingerprintStore: { fingerprintList, saveFingerprintId, deleteFingerprint, updateFingerprintName, updateFingerprint },
  } = useStores()

  useEffect(() => {
    saveFingerprintId(props.route.params.fingerprintId)
  }, [])

  const fingerprint = fingerprintList.find(f => f.fingerprintId === props.route.params.fingerprintId)!
  const renderPeriod = useCallback(() => {
    switch (fingerprint.fingerprintType) {
      case 1:
        if (fingerprint.startDate === 0 && fingerprint.endDate === 0) {
          return <Text style={$formalText}>Permanent</Text>
        }
        return (
          <View>
            <Text style={$smallText}>{moment(fingerprint.startDate).format("YYYY-MM-DD HH:mm")}</Text>
            <Text style={$smallText}>{moment(fingerprint.endDate).format("YYYY-MM-DD HH:mm")}</Text>
          </View>
        )
      case 4:
        return <Text>{`${convertTimeStampToDate(fingerprint.startDate)} - ${convertTimeStampToDate(fingerprint.endDate)}`}</Text>
      default:
        return <Text>Invalid fingerprintType: {fingerprint.fingerprintType}</Text>
    }
  }, [fingerprint])

  const submit = useCallback(() => {
    const { startDate, endDate, cyclicConfig } = fingerprint
    const startDate2 = new Date(startDate).toLocaleDateString("en-CA")
    const endDate2 = new Date(endDate).toLocaleDateString("en-CA")
    const startTime2 = `${Math.floor(cyclicConfig[0].startTime / 60).toString().padStart(2, "0")}:${(cyclicConfig[0].startTime % 60).toString().padStart(2, "0")}`
    const endTime2 = `${Math.floor(cyclicConfig[0].endTime / 60).toString().padStart(2, "0")}:${(cyclicConfig[0].endTime % 60).toString().padStart(2, "0")}`
    const cycleDays2 = cyclicConfig.map(c => c.weekDay === 7 ? 0 : c.weekDay)
    const updateDateTime = async (config) => {
      const startDate = new Date(`${config.startDate} 00:00:00`).getTime()
      const endDate = new Date(`${config.endDate} 23:59:59`).getTime()
      const startTime = parseInt(config.startTime.slice(0, 2)) * 60 + parseInt(config.startTime.slice(3, 5))
      const endTime = parseInt(config.endTime.slice(0, 2)) * 60 + parseInt(config.endTime.slice(3, 5))
      const cyclicConfig = config.cycleDays!.map((day) => ({
        weekDay: [7, 1, 2, 3, 4, 5, 6][day],
        startTime,
        endTime,
      }))
      const res = await updateFingerprint(startDate, endDate, cyclicConfig)
      if (res) props.navigation.goBack()
    }
    props.navigation.navigate("Fingerprint Validity Period", { updateDateTime, startDate2, startTime2, endDate2, endTime2, cycleDays2 })
  }, [])

  if (!fingerprint) { // After delete the fingerprint, the fingerprint will be removed from the store immediately. So return null.
    props.navigation.goBack()
    return null
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Fingerprint Number</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{fingerprint.fingerprintNumber}</ListItem.Subtitle>
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            fire({
              title: "Edit name",
              actions: [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async (data) => {
                    const res = await updateFingerprintName(data.name)
                  },
                },
              ],
              fields: [
                {
                  name: "name",
                  defaultValue: fingerprint.fingerprintName,
                  placeholder: "Please enter a Name"
                },
              ],
            })
          }}
        >
          <ListItem.Content>
            <ListItem.Title>Name</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{fingerprint.fingerprintName}</ListItem.Subtitle>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={fingerprint.fingerprintType === 4 ? submit : () => props.navigation.navigate("Fingerprint Change Period", { fingerprint })}
        >
          <ListItem.Content>
            <ListItem.Title>Validity Period</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>
            {renderPeriod()}
          </ListItem.Subtitle>
          <ListItem.Chevron />
        </ListItem>
        {fingerprint.fingerprintType === 4 && ( // TODO check whether TTLock supports it
          <>
            <ListItem topDivider bottomDivider onPress={submit}>
              <ListItem.Content>
                <ListItem.Title>Cycle Time</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{Math.floor(fingerprint.cyclicConfig[0].startTime / 60).toString().padStart(2, "0")}:{(fingerprint.cyclicConfig[0].startTime % 60).toString().padStart(2, "0")} - {Math.floor(fingerprint.cyclicConfig[0].endTime / 60).toString().padStart(2, "0")}:{(fingerprint.cyclicConfig[0].endTime % 60).toString().padStart(2, "0")}</ListItem.Subtitle>
              <ListItem.Chevron />
            </ListItem>
            <ListItem topDivider bottomDivider onPress={submit}>
              <ListItem.Content>
                <ListItem.Title>Cycle on</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{fingerprint.cyclicConfig.map((item) => [null, "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][item.weekDay]).join(", ")}</ListItem.Subtitle>
              <ListItem.Chevron />
            </ListItem>
          </>
        )}
        <DemoDivider />
        <ListItem topDivider bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Operator</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{fingerprint.senderUsername}</ListItem.Subtitle>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Time</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>
            {moment(fingerprint.createDate).format("YYYY-MM-DD HH:mm:ss")}
          </ListItem.Subtitle>
        </ListItem>
        <DemoDivider />
        <ListItem bottomDivider onPress={() => props.navigation.navigate("Passcode Records")}>
          <ListItem.Content>
            <ListItem.Title>Records</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <DemoDivider size={50} />
        <ListItem
          topDivider
          bottomDivider
          containerStyle={$ListItemContainer}
          onPress={() =>
            fire({
              title: "Delete?",
              actions: [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: async () => {
                    const res = await deleteFingerprint(fingerprint.fingerprintId)
                    // if (res) props.navigation.goBack()
                  },
                },
              ],
              fields: [],
            })
          }
        >
          <ListItem.Title style={$ListItemTitle}>Delete</ListItem.Title>
        </ListItem>
      </View>
    </Screen>
  )
})


const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
  height: "100%",
}

const $formalText: TextStyle = {
  fontSize: 16,
}

const $smallText: TextStyle = {
  fontSize: 12,
}

const $ListItemContainer: ViewStyle = {
  justifyContent: "center",
}

const $ListItemTitle: TextStyle = {
  color: "red",
}
