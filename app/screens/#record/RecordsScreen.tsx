import React, { FC, useEffect, useRef, useState } from "react"
import {
  Image,
  RefreshControl,
  View,
  ViewStyle,
  FlatList,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native"
import { Observer, observer } from "mobx-react"
// import { Avatar, ListItem, SearchBar } from "react-native-elements"
import { Avatar, Dialog, Divider, ListItem, SearchBar } from "@rneui/themed"
import StickyHeaderFlatlist from "react-native-sticky-header-flatlist"
import FeatherIcons from "react-native-vector-icons/Feather"
import { HeaderButtons, HiddenItem, OverflowMenu, overflowMenuPressHandlerDropdownMenu } from "react-navigation-header-buttons"
import Icon from "react-native-vector-icons/FontAwesome"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Text, Screen } from "../../components"
import { convertTimeStamp, convertTimeStampToDate } from "../../utils/ttlock2nd"
import { fire } from "react-native-alertbox"
import DateTimePickerModal from "react-native-modal-datetime-picker"

const noData = require("../../../assets/images/noData2nd.png")

// function getValidity(card) {
//   const currentTime = Date.now()
//   switch (card.cardType) {
//     case 1:
//       if (card.startDate === 0 && card.endDate === 0) { // Permanent
//         return ""
//       }
//       // Timed
//       return card.startDate > currentTime ? "Inactive" : (card.endDate < currentTime ? "Invalid" : "")
//     case 4: // Recurring
//       return (card.startDate < currentTime && card.endDate > currentTime) || "Invalid"
//     default:
//       return `Invalid cardType: ${card.cardType}`
//   }
// }
//
// function generateCardInfo(card) {
//   switch (card.cardType) {
//     case 1:
//       if (card.startDate === 0 && card.endDate === 0) { // Permanent
//         return convertTimeStamp(card.createDate) + " Permanent"
//       }
//       // Timed
//       return `${convertTimeStamp(card.startDate)} - ${convertTimeStamp(card.endDate)} Timed`
//     case 4: // Recurring
//       return `${convertTimeStampToDate(card.startDate)} - ${convertTimeStampToDate(card.endDate)} Recurring`
//     default:
//       return `Invalid cardType: ${card.cardType}`
//   }
// }

export const RecordsScreen: FC<any> = observer(function RecordsScreen(props) {
  const {
    recordStore: { recordList, recordList2, isRefreshing, saveLockId, getRecordList2, removeAllRecordsFromStore, uploadRecords, deleteRecord, exportExcel }
  } = useStores()

  const [searchText, setSearchText] = useState<string>("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    removeAllRecordsFromStore() // clean card store at the beginning
    saveLockId(props.route.params.lockId)
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <OverflowMenu
            style={{ marginHorizontal: 10 }}
            OverflowIcon={({ color }) => (
              <FeatherIcons name="more-vertical" size={23} color="white" />
            )}
            onPress={overflowMenuPressHandlerDropdownMenu}
          >
            <HiddenItem title="Refresh Records" onPress={uploadRecords} />
            {props.route.params.isAdmin && (
              <HiddenItem
                title="Clear records"
                onPress={() =>
                  fire({
                    title: "Continue to delete records?",
                    message: "The records cannot be recovered after deleting.",
                    actions: [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: async () => {
                          removeAllRecordsFromStore()
                          // const res = await clearAllCards()
                        },
                      },
                    ],
                    fields: [],
                  })
                }
              />
            )}
            <HiddenItem title="Exports records" onPress={() => setVisible(true)} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    })
    getRecordList2()
    const unsubscribe = props.navigation.addListener('focus', () => { // auto refresh after delete a card
      // if (refreshRef.current) {
      //   getCardList()
      //   refreshRef.current = false
      // }
    });
    return unsubscribe
  }, [])

  // const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [endDate, setEndDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)

  const scrollView = useRef(null)
  const scrollView2 = useRef(null)

  // if (isRefreshing === true && Platform.OS === "ios") { // TODO fix ios indicator display issue
  //   console.log("scrollView", scrollView?.current?.scrollToOffset)
  //   console.log("scrollView2", scrollView2?.current?.scrollToOffset)
  //   scrollView?.current?.scrollToOffset({ offset: -65, animated: true })
  //   scrollView2?.current?.scrollToOffset({ offset: -65, animated: true })
  // }


  return (
    <>
      <Text style={{ padding: 10, fontSize: 13, color: "grey" }}>
        Records can be only kept for a limited period. Please export regularly, if you need to keep
        history.
      </Text>
      <SearchBar
        platform="ios"
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
        returnKeyType="search"
        onSubmitEditing={({ nativeEvent: { text } }) => getRecordList2(text)}
      />
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        {recordList2.length > 0 ? ( // TODO fix android version issue or add comment
          <StickyHeaderFlatlist // TODO optimize flatlist
            ref={scrollView2}
            keyExtractor={(_, i) => i + ""}
            data={recordList2}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getRecordList2} />}
            renderHeader={({ item }) => {
              return (
                <Text
                  style={{
                    padding: 10,
                    paddingLeft: 20,
                    backgroundColor: "#eee",
                  }}
                  key={(Math.random() + 1).toString(36).substring(2)}
                >
                  {item.title}
                </Text>
              )
            }}
            renderItem={({ item, index }) => {
              return (
                <Observer>
                  {() => (
                <ListItem
                  key={(Math.random() + 1).toString(36).substring(2)}
                  topDivider
                  bottomDivider
                  onLongPress={() =>
                    fire({
                      title: "Continue to delete the record?",
                      message: "The record cannot be recovered after deleting",
                      actions: [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          onPress: async () => {
                            const res = await deleteRecord(item.recordId)
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
                        <Text style={{ fontSize: 18 }}>{item.username}</Text>
                        {/* <Text style={{ color: "red" }}>{getValidity(item)}</Text> */}
                      </View>
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ color: colors.palette.neutral300, fontSize: 13 }}>
                      {/* {generateCardInfo(item)} */}
                      {item.lockDateDescribe.slice(0, 10)} {item.recordTypeDescribe}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
                  )}
                </Observer>
              )
            }}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        ) : (
          <FlatList
            ref={scrollView}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getRecordList2} />}
            contentContainerStyle={{
              height: "100%",
              justifyContent: "center",
            }}
            style={{minHeight: 100}}
          >
            <View style={{ alignItems: "center" }}>
              <Image resizeMode="center" source={noData} style={{ height: 100 }} />
              <Text style={{ color: colors.palette.neutral400 }}>No Data</Text>
            </View>
          </FlatList>
        )}
        <Dialog
          isVisible={visible}
          onBackdropPress={() => setVisible(v => !v)}
          overlayStyle={{ paddingHorizontal: 0, paddingBottom: 5, borderRadius: 10 }}
          style={{ paddingBottom: 0 }}
        >
          <Dialog.Title title="Export records" titleStyle={{ textAlign: "center", fontWeight: "normal", marginBottom: 20 }} />
          <Text style={{ backgroundColor: "#F0F0F0", padding: 10 }}>You can export records of the last half year.</Text>
          <Dialog.Title title="Select time period" titleStyle={{ textAlign: "center", paddingTop: 10 }} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
            <TouchableWithoutFeedback onPress={() => {
              setDate(new Date(`${startDate}`))
              setDateVisible(true)
              setIsStart(true)
            }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "lightgrey" }}>
                <Text>{startDate}</Text>
                <Text> </Text>
                <Icon name="sort-down" size={16} />
              </View>
            </TouchableWithoutFeedback>
            <FeatherIcons name="minus" size={16} />
            <TouchableWithoutFeedback onPress={() => {
              setDate(new Date(`${endDate}`))
              setDateVisible(true)
              setIsStart(false)
            }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "lightgrey" }}>
                <Text>{endDate}</Text>
                <Text> </Text>
                <Icon name="sort-down" size={16} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Divider />
          <Dialog.Button titleStyle={{ fontSize: 20 }} onPress={async () => {
            setVisible(false)
            const res = await exportExcel(new Date(`${startDate} 00:00:00`).getTime(), new Date(`${endDate} 23:59:59`).getTime())
            if (res) props.navigation.navigate("Exported Result")
          }}>Export</Dialog.Button>
          <DateTimePickerModal
            isVisible={dateVisible}
            mode="date"
            date={date}
            minimumDate={new Date(`2000-01-01`)}
            maximumDate={new Date()}
            onConfirm={(date) => {
              console.log("A date has been picked: ", date.toLocaleDateString("en-CA"))
              setDateVisible(false)
              if (isStart) {
                setStartDate(date.toLocaleDateString("en-CA"))
              } else {
                setEndDate(date.toLocaleDateString("en-CA"))
              }
            }}
            onCancel={() => setDateVisible(false)}
          />
        </Dialog>
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
