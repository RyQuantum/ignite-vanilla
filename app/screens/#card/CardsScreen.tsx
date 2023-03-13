import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react"
import { Avatar, ListItem, SearchBar } from "react-native-elements"
import { Alert, FlatList, Image, RefreshControl, Text, View, ViewStyle } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import moment from "moment-timezone"
import { HeaderButtons, HiddenItem, Item, OverflowMenu } from "react-navigation-header-buttons"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Button, Screen } from "../../components"

const noData = require("../../../assets/images/noData2nd.png")
let currentTimezone = moment.tz.guess()

export const convertTimeStamp = (timestamp: number) => {
  return moment(timestamp).tz(currentTimezone).format("YYYY.MM.DD HH:mm")
}

export const convertTimeStampToDate = (timestamp: number) => {
  return moment(timestamp).tz(currentTimezone).format("YYYY.MM.DD")
}

export const convertTimeStampToTime = (timestamp: number) => {
  return moment(timestamp).tz(currentTimezone).format("HH:mm")
}

function getValidity(card) {
  const currentTime = Date.now()
  switch (card.cardType) {
    case 1:
      if (card.startDate === 0 && card.endDate === 0) { // Permanent
        return ""
      }
      // Timed
      return (card.startDate < currentTime && card.endDate > currentTime) || "Invalid"
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

export const CardsScreen: FC<any> = observer(function CardsScreen(props) {
  currentTimezone = moment.tz.guess()
  const {
    cardStore: { cardList, isRefreshing, updateLockId, getCardList, resetStore, deleteCard }
  } = useStores()

  const [searchText, setSearchText] = useState<string>("")
  const refreshRef = useRef(true)

  // const isFocused = useIsFocused();
  // if (isFocused && needRefresh) {
  //   console.log(0)
  //   getCardList()
  //   setNeedRefresh(false)
  // }

  useEffect(() => {
    console.log("run")
    resetStore() // clean card store at the beginning
    updateLockId(props.route.params.lockId)
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          {/* <OverflowMenu // TODO for adding card by gateway */}
          {/*   style={{ marginHorizontal: 10 }} */}
          {/*   OverflowIcon={({ color }) => <MaterialIcons name="more-vert" size={23} color="white" />} */}
          {/* > */}
          {/*   <HiddenItem title="hidden1" onPress={() => alert('hidden1')} /> */}
          {/*   <HiddenItem title="hidden2" onPress={() => alert('hidden2')} /> */}
          {/* </OverflowMenu> */}
          <Item title="Reset" buttonStyle={{ color: "white" }}
                onPress={() => Alert.alert("ALL Passcodes for this Lock will be DELETED", undefined, [{
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                  {
                    text: "Reset",
                    onPress: async () => {
                      // const res = await this.context.codeStore.resetAllCodes(this.props.route.params.lockId)
                      // if (res) this.props.navigation.goBack()
                    },
                  },
                ])} />
        </HeaderButtons>
      ),
    })
    const unsubscribe = props.navigation.addListener('focus', () => { // auto refresh after delete a code
      if (refreshRef.current) {
        getCardList()
        refreshRef.current = false
      }
    });
    return unsubscribe
  }, [])

  return (
    <>
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
          data={cardList}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getCardList} />}
          renderItem={({ item, index }) => {
            const cardId = item.cardId
            return (
              <ListItem
                topDivider
                bottomDivider
                onPress={() => props.navigation.navigate("Card Info", { cardId })}
                onLongPress={() =>
                  Alert.alert("Delete?", undefined, [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: async () => {
                        const res = await deleteCard(item.cardId)
                        // if (res) this.props.navigation.goBack()
                      },
                    },
                  ])
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
                      <Text style={{ fontSize: 18 }}>
                        {item.cardName}
                      </Text>
                      <Text style={{ color: "red" }}>{getValidity(item)}</Text>
                    </View>
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: colors.palette.neutral300, fontSize: 13 }}>
                    {generateCardInfo(item)}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )
          }}
          ListEmptyComponent={
            <View style={{ height: 400, justifyContent: "center", alignItems: "center" }}>
              <Image resizeMode="center" source={noData} style={{ height: 100 }} />
              <Text style={{ color: colors.palette.neutral400 }}>No Data</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        {/* <ListItem */}
        {/*   topDivider */}
        {/*   bottomDivider */}
        {/*   onPress={() => // TODO correct cardId */}
        {/*     props.navigation.navigate("Card Info", { cardId: 0 })} */}
        {/*   onLongPress={() => */}
        {/*     Alert.alert("Delete?", undefined, [ */}
        {/*       { */}
        {/*         text: "Cancel", */}
        {/*         onPress: () => console.log("Cancel Pressed"), */}
        {/*         style: "cancel", */}
        {/*       }, */}
        {/*       { */}
        {/*         text: "Delete", */}
        {/*         onPress: async () => { */}
        {/*           const res = await deleteCode(item.lockId, item.keyboardPwdId) */}
        {/*           // if (res) this.props.navigation.goBack() */}
        {/*         }, */}
        {/*       }, */}
        {/*     ]) */}
        {/*   } */}
        {/*   containerStyle={{ width: "100%" }} */}
        {/* > */}
        {/*   <Avatar */}
        {/*     rounded */}
        {/*     icon={{ */}
        {/*       name: "credit-card-wireless", */}
        {/*       type: "material-community", */}
        {/*       color: "white", */}
        {/*       size: 26, */}
        {/*     }} */}
        {/*     containerStyle={{ backgroundColor: "skyblue" }} */}
        {/*   /> */}
        {/*   <ListItem.Content> */}
        {/*     <ListItem.Title> */}
        {/*       {"name" || item.keyboardPwdName || item.keyboardPwd} */}
        {/*     </ListItem.Title> */}
        {/*     <ListItem.Subtitle style={{ color: colors.palette.neutral300, fontSize: 13 }}> */}
        {/*       {generateCardInfo(null)} */}
        {/*     </ListItem.Subtitle> */}
        {/*   </ListItem.Content> */}
        {/* </ListItem> */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            // height: 100,
            width: "100%",
            backgroundColor: colors.background,
          }}
        >
          <Button
            preset="filled"
            style={{
              margin: 10,
              borderRadius: 10,
              backgroundColor: "white",
              height: 60,
            }}
            textStyle={{ color: "skyblue" }}
            LeftAccessory={(props) => (
              <MaterialCommunityIcons
                style={props.style}
                color="skyblue"
                size={28}
                name="plus-circle"
              />
            )}
            onPress={() =>
              props.navigation.navigate("Add Card", {
                lockId: props.route.params.lockId,
                refreshRef,
              })
            }
          >
            Add Card
          </Button>
        </View>
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
