import React, { FC, useCallback, useEffect } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Text, View, ViewStyle } from "react-native"
import { ListItem } from "react-native-elements"
import { fire } from "react-native-alertbox"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import moment from "moment-timezone"
import { Screen } from "../../components"
import { convertTimeStampToDate } from "../../utils/ttlock2nd"

export const FingerprintInfoScreen: FC<any> = observer(function FingerprintInfoScreen(props) {

  const {
    fingerprintStore: { fingerprintList, saveFingerprintId, deleteFingerprint, updateFingerprintName },
  } = useStores()

  useEffect(() => {
    saveFingerprintId(props.route.params.fingerprintId)
  }, [])

  const fingerprint = fingerprintList.find(f => f.fingerprintId === props.route.params.fingerprintId)!
  const renderPeriod = useCallback(() => {
    switch (fingerprint.fingerprintType) {
      case 1:
        if (fingerprint.startDate === 0 && fingerprint.endDate === 0) {
          return <Text style={{ fontSize: 16 }}>Permanent</Text>
        }
        return (
          <View>
            <Text style={{ fontSize: 12 }}>{moment(fingerprint.startDate).format("YYYY-MM-DD HH:mm")}</Text>
            <Text style={{ fontSize: 12 }}>{moment(fingerprint.endDate).format("YYYY-MM-DD HH:mm")}</Text>
          </View>
        )
      case 4:
        return <Text>{`${convertTimeStampToDate(fingerprint.startDate)} - ${convertTimeStampToDate(fingerprint.endDate)}`}</Text>
      default:
        return <Text>Invalid fingerprintType: {fingerprint.fingerprintType}</Text>
    }
  }, [fingerprint])

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
          onPress={() => props.navigation.navigate("Fingerprint Change Period", { fingerprint })}
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
            <ListItem topDivider bottomDivider>
              <ListItem.Content>
                <ListItem.Title>Cycle Time</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{moment(fingerprint.startDate).format("HH:mm")} - {moment(fingerprint.endDate).format("HH:mm")}</ListItem.Subtitle>
            </ListItem>
            <ListItem topDivider bottomDivider>
              <ListItem.Content>
                <ListItem.Title>Cycle on</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{fingerprint.fingerprintName}</ListItem.Subtitle>
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
            {moment(fingerprint.createDate).format("YYYY-MM-DD HH:mm")}
          </ListItem.Subtitle>
        </ListItem>
        <DemoDivider />
        <ListItem bottomDivider onPress={() => props.navigation.navigate("Records")}>
          <ListItem.Content>
            <ListItem.Title>Records</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <DemoDivider size={50} />
        <ListItem
          topDivider
          bottomDivider
          containerStyle={{ justifyContent: "center" }}
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
          <ListItem.Title style={{ color: "red" }}>Delete</ListItem.Title>
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
