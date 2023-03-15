import React, { FC, useEffect, useRef, useState } from "react"
import { Observer, observer } from "mobx-react"
import { Avatar, ListItem, SearchBar } from "react-native-elements"
import { FlatList, Image, RefreshControl, View, ViewStyle } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Text, Screen } from "../../components"
import { convertTimeStamp, convertTimeStampToDate } from "../../utils/ttlock2nd"
import { fire } from "react-native-alertbox"

const noData = require("../../../assets/images/noData2nd.png")

function getValidity(card) {
  const currentTime = Date.now()
  switch (card.cardType) {
    case 1:
      if (card.startDate === 0 && card.endDate === 0) { // Permanent
        return ""
      }
      // Timed
      return card.startDate > currentTime ? "Inactive" : (card.endDate < currentTime ? "Invalid" : "")
    case 4: // Recurring
      return (card.startDate < currentTime && card.endDate > currentTime) || "Invalid"
    default:
      return `Invalid cardType: ${card.cardType}`
  }
}

function generateCardInfo(card) {
  switch (card.cardType) {
    case 1:
      if (card.startDate === 0 && card.endDate === 0) { // Permanent
        return convertTimeStamp(card.createDate) + " Permanent"
      }
      // Timed
      return `${convertTimeStamp(card.startDate)} - ${convertTimeStamp(card.endDate)} Timed`
    case 4: // Recurring
      return `${convertTimeStampToDate(card.startDate)} - ${convertTimeStampToDate(card.endDate)} Recurring`
    default:
      return `Invalid cardType: ${card.cardType}`
  }
}

export const RecordsScreen: FC<any> = observer(function RecordsScreen(props) {
  const {
    recordStore: { recordList, isRefreshing, saveLockId, getRecordList, removeAllRecordsFromStore, deleteCard, clearAllCards }
  } = useStores()

  const [searchText, setSearchText] = useState<string>("")
  // const refreshRef = useRef(true)

  useEffect(() => {
    removeAllRecordsFromStore() // clean card store at the beginning
    saveLockId(props.route.params.lockId)
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title="Reset"
            buttonStyle={{ color: "white" }}
            onPress={() =>
              fire({
                title: "ALL Passcodes for this Lock will be DELETED",
                actions: [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: async () => {
                      const res = await clearAllCards()
                    },
                  },
                ],
                fields: [],
              })
            }
          />
        </HeaderButtons>
      ),
    })
    getRecordList()
    const unsubscribe = props.navigation.addListener('focus', () => { // auto refresh after delete a card
      // if (refreshRef.current) {
      //   getCardList()
      //   refreshRef.current = false
      // }
    });
    return unsubscribe
  }, [])

  return (
    <>
      <Text style={{ padding: 10, fontSize: 13, color: "grey" }}>Records can be only kept for a limited period. Please export regularly, if you need to keep history.</Text>
      <SearchBar
        platform="ios"
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        returnKeyType="search"
        onSubmitEditing={(e) => console.log(JSON.stringify(e))}
      />
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList
          data={recordList}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getRecordList} />}
          renderItem={({ item, index }) => {
            const cardId = item.cardId
            return (
              <Observer>
                {() => (
                  <ListItem
                    topDivider
                    bottomDivider
                    onPress={() => props.navigation.navigate("Card Info", { cardId })}
                    onLongPress={() =>
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
                              const res = await deleteCard(item.cardId)
                              // if (res) this.props.navigation.goBack()
                            },
                          },
                        ],
                        fields: [],
                      })
                    }
                    containerStyle={{ width: "100%" }}
                  >
                    <Avatar
                      rounded
                      icon={{
                        name: "credit-card-wireless",
                        type: "material-community",
                        color: "white",
                        size: 26,
                      }}
                      containerStyle={{ backgroundColor: "skyblue" }}
                    />
                    <ListItem.Content>
                      <ListItem.Title>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            minWidth: 260,
                          }}
                        >
                          <Text style={{ fontSize: 18 }}>{item.cardName}</Text>
                          {/* <Text style={{ color: "red" }}>{getValidity(item)}</Text> */}
                        </View>
                      </ListItem.Title>
                      <ListItem.Subtitle style={{ color: colors.palette.neutral300, fontSize: 13 }}>
                        {/* {generateCardInfo(item)} */}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                )}
              </Observer>
            )
          }}
          ListEmptyComponent={
            <View style={{ height: 390, justifyContent: "center", alignItems: "center" }}>
              <Image resizeMode="center" source={noData} style={{ height: 100 }} />
              <Text style={{ color: colors.palette.neutral400 }}>No Data</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </Screen>
    </>
  )
})

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}
