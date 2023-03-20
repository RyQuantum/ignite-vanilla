import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import {
  Image,
  RefreshControl,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { Observer, observer } from "mobx-react"
// import { Avatar, ListItem, SearchBar } from "react-native-elements"
import { Avatar, Dialog, Divider, ListItem, SearchBar, Button } from "@rneui/themed"
import { FlashList } from "@shopify/flash-list"
import FeatherIcons from "react-native-vector-icons/Feather"
import { HeaderButtons, HiddenItem, OverflowMenu, overflowMenuPressHandlerDropdownMenu } from "react-navigation-header-buttons"
import Icon from "react-native-vector-icons/FontAwesome"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Text, Screen } from "../../components"
import { fire } from "react-native-alertbox"
import DateTimePickerModal from "react-native-modal-datetime-picker"

const noData = require("../../../assets/images/noData2nd.png")

const dictionary = {
  1: "account",
  4: "dots-grid",
  7: "credit-card-wireless",
  8: "fingerprint",
  11: "account",
  12: "router-wireless",
  48: "alert-outline",
  55: "remote",
}
const MyAvatar = ({ item }) => {
  const name = dictionary[item.recordType] || "blank"
  const backgroundColor = item.recordType === 48 ? "red" : "skyblue"
  return (
    <Avatar
      rounded
      icon={{
        name,
        type: "material-community",
        color: "white",
        size: 26,
      }}
      containerStyle={{ backgroundColor }}
    />
  )
}

export const RecordsScreen: FC<any> = observer(function RecordsScreen(props) {
  const {
    recordStore: { recordListAndIndices: { indices, recordList }, isRefreshing, saveLockId, getRecordList, removeAllRecordsFromStore, uploadRecords, deleteRecord, exportExcel }
  } = useStores()

  const [searchText, setSearchText] = useState<string>("")
  const [optionsVisible, setOptionsVisible] = useState(false)
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
    getRecordList(undefined, undefined, 1)
  }, [])

  // const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [startDate, setStartDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [endDate, setEndDate] = useState<string>(new Date().toLocaleDateString("en-CA"))
  const [date, setDate] = useState<Date>(new Date())  // for datetime modal picker
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const [isStart, setIsStart] = useState<boolean>(false)

  const scrollView = useRef(null)

  const fireDeleteAlert = useCallback(
    (item) => () =>
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
      }),
    [],
  )

  const getRecordListByRecordType = async (recordType: number) => {
    Keyboard.dismiss()
    setOptionsVisible(false)
    const res = await getRecordList(undefined, recordType, 1)
    scrollView.current?.scrollToOffset(0)
  }

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
        onTouchStart={() => setOptionsVisible(true)}
        onKeyPress={() => setOptionsVisible(false)}
        onCancel={() => setOptionsVisible(false)}
        onSubmitEditing={async () => {
          const res = await getRecordList(searchText, undefined, 1)
          scrollView.current?.scrollToOffset(0)
        }}
      />
      {optionsVisible && (
        <View style={{ flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", padding: 20, backgroundColor: colors.background }}>
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(1)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="Unlock with App" />
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(11)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="Lock with App" />
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(7)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="IC" />
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(4)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="Passcode" />
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(8)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="Fingerprint" />
          <Button type="outline" size="sm" onPress={() => getRecordListByRecordType(55)} containerStyle={{ margin: 5, backgroundColor: "white" }} title="Remote" />
        </View>
      )}
      <Screen
        preset="fixed"
        contentContainerStyle={$screenContentContainer}
      >
        <FlashList
          ref={scrollView}
          // keyExtractor={(_, i) => i + ""}
          data={recordList}
          stickyHeaderIndices={indices}
          onEndReached={() => recordList.length > 0 && getRecordList(searchText)} // FlashList bug: execute onEndReached function if the list is empty on loading
          onEndReachedThreshold={0}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => getRecordList(searchText, undefined, 1)} />}
          ListEmptyComponent={
            <View style={{ paddingTop: 100 }}>
              <View style={{ alignItems: "center" }}>
                <Image resizeMode="center" source={noData} style={{ height: 100 }} />
                <Text style={{ color: colors.palette.neutral400 }}>No Data</Text>
              </View>
            </View>
          }
          renderItem={({ item, index }) => {
            if (indices.includes(index)) {
              return (
                <Text
                  style={{
                    padding: 10,
                    paddingLeft: 20,
                    backgroundColor: "#eee",
                  }}
                  key={index}
                >
                  {item.title}
                </Text>
              )
            }
            return (
              <Observer>
                {() => (
              <ListItem
                key={item.recordId}
                topDivider
                bottomDivider
                onLongPress={fireDeleteAlert(item)}
                containerStyle={{ width: "100%" }}
              >
                <MyAvatar item={item} />
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
                      <Text style={{ fontSize: 18 }}>{item.recordType === 48 ? "WARNING!" : item.username}</Text>
                    </View>
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: colors.palette.neutral500, fontSize: 13 }}>
                    {item.lockDateDescribe.slice(11)} {item.recordTypeDescribe} {item.recordType === 4 && (item.keyboardPwd.slice(0, item.keyboardPwd.length - 3) + "*** ")}{item.success === 0 && "failed"}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
                )}
              </Observer>
            )
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
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
