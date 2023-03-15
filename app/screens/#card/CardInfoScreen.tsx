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

export const CardInfoScreen: FC<any> = observer(function CardInfoScreen(props) {

  const {
    cardStore: { cardList, saveCardId, deleteCard, updateCardName },
  } = useStores()

  useEffect(() => {
    saveCardId(props.route.params.cardId)
  }, [])

  const card = cardList.find(c => c.cardId === props.route.params.cardId)!
  const renderPeriod = useCallback(() => {
    switch (card.cardType) {
      case 1:
        if (card.startDate === 0 && card.endDate === 0) {
          return <Text style={{ fontSize: 16 }}>Permanent</Text>
        }
        return (
          <View>
            <Text style={{ fontSize: 12 }}>{moment(card.startDate).format("YYYY-MM-DD HH:mm")}</Text>
            <Text style={{ fontSize: 12 }}>{moment(card.endDate).format("YYYY-MM-DD HH:mm")}</Text>
          </View>
        )
      case 4:
        return <Text>{`${convertTimeStampToDate(card.startDate)} - ${convertTimeStampToDate(card.endDate)}`}</Text>
      default:
        return <Text>Invalid cardType: {card.cardType}</Text>
    }
  }, [card])

  if (!card) { // After delete the card, the card will be removed from the store immediately. So return null.
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
            <ListItem.Title>Card Number</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{card.cardNumber}</ListItem.Subtitle>
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
                    const res = await updateCardName(data.name)
                  },
                },
              ],
              fields: [
                {
                  name: "name",
                  defaultValue: card.cardName,
                  placeholder: "Please enter a Name"
                },
              ],
            })
          }}
        >
          <ListItem.Content>
            <ListItem.Title>Name</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{card.cardName}</ListItem.Subtitle>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => props.navigation.navigate("Card Change Period", { card })}
        >
          <ListItem.Content>
            <ListItem.Title>Validity Period</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>
            {renderPeriod()}
          </ListItem.Subtitle>
          <ListItem.Chevron />
        </ListItem>
        {card.cardType === 4 && ( // TODO TTLock doesn't support
          <>
            <ListItem topDivider bottomDivider>
              <ListItem.Content>
                <ListItem.Title>Cycle Time</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{moment(card.startDate).format("HH:mm")} - {moment(card.endDate).format("HH:mm")}</ListItem.Subtitle>
            </ListItem>
            <ListItem topDivider bottomDivider>
              <ListItem.Content>
                <ListItem.Title>Cycle on</ListItem.Title>
              </ListItem.Content>
              <ListItem.Subtitle>{card.cardName}</ListItem.Subtitle>
            </ListItem>
          </>
        )}
        <DemoDivider />
        <ListItem topDivider bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Operator</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>{card.senderUsername}</ListItem.Subtitle>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Time</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>
            {moment(card.createDate).format("YYYY-MM-DD HH:mm")}
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
                    const res = await deleteCard(card.cardId)
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
