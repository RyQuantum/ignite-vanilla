import React, { FC } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../models"
import { Alert, Text, View, ViewStyle } from "react-native"
import { ListItem } from "react-native-elements"
import { fire } from "react-native-alertbox"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import moment from "moment-timezone"
import { Screen } from "../../components"
import { convertTimeStampToDate } from "./CardsScreen"

function Period({ card }) {
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
}

export const CardInfoScreen: FC<any> = observer(function CardInfoScreen(props) {
  const {
    cardStore: { cardList },
  } = useStores()
  const card = cardList.find(c => c.cardId === props.route.params.cardId)!

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
          {/* {[1, 4].includes(card.keyboardPwdType) || <ListItem.Chevron />} */}
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
                    // TODO add funciton
                    // const res = await updateCodeName(code.keyboardPwdId, data.name)
                  },
                },
              ],
              fields: [
                {
                  name: "name",
                  defaultValue: card.cardName,
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
          onPress={() => props.navigation.navigate("Validity Period", { card })}
        >
          <ListItem.Content>
            <ListItem.Title>Validity Period</ListItem.Title>
          </ListItem.Content>
          <ListItem.Subtitle>
            <Period card={card} />
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
          onPress={async () =>
            Alert.alert("Delete?", undefined, [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: async () => {
                  const res = await deleteCode(code.lockId, code.keyboardPwdId)
                  // if (res) this.props.navigation.goBack()
                },
              },
            ])
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
