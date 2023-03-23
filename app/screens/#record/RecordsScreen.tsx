import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import {
  Image,
  RefreshControl,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
  TextStyle,
  ImageStyle,
  Platform,
} from "react-native"
import { observer } from "mobx-react"
import { ListItem } from "react-native-elements"
import { Avatar, Dialog, Divider, SearchBar, Button } from "@rneui/themed"
import { FlashList } from "@shopify/flash-list"
import FeatherIcons from "react-native-vector-icons/Feather"
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
  overflowMenuPressHandlerDropdownMenu,
} from "react-navigation-header-buttons"
import Icon from "react-native-vector-icons/FontAwesome"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Text, Screen } from "../../components"
import { fire } from "react-native-alertbox"
import DateTimePickerModal from "react-native-modal-datetime-picker"

const noData = require("../../../assets/images/noData2nd.png")

const iconMap = { // TODO verify all record type
  1: "account",               // unlock by app
  4: "dots-grid",             // unlock by passcode
  7: "credit-card-wireless",  // unlock by IC card
  8: "fingerprint",           // unlock by fingerprint
  11: "account",              // lock by app
  12: "router-wireless",      // unlock by gateway
    15: "credit-card-wireless", // add card success
    16: "credit-card-wireless", // clear cards
    17: "credit-card-wireless", // unlock by card success
    18: "credit-card-wireless", // delete an card
    20: "fingerprint",          // unlock by fingerprint success
    21: "fingerprint",          // add fingerprint
    22: "fingerprint",          // unlock by fingerprint failed—fingerprint expired
    23: "fingerprint",          // delete a fingerprint
    24: "fingerprint",          // clear fingerprints
    25: "credit-card-wireless", // unlock by card failed—card expired
    26: "account",               // lock by app
  47: "lock",                 // lock by lock key
  48: "alert-outline",        // System locked
  55: "remote",               // Unlock with key fob
}

const titleMap = {
  // 16: "Clean all card",
  // 24: "Clean all fingerprint",
  // 47: "Lock",
  // 48: "WARNING!",
}

const RecordListItem = ({ item, onLongPress }) => {
  const icon = {
    name: iconMap[item.recordType],
    type: "material-community",
    color: "white",
    size: 26,
  }
  const title = titleMap[item.recordType] || item.username
  const titleColor = item.recordType === 48 ? "red" : "black"
  const backgroundColor = item.recordType === 48 ? "red" : "skyblue"
  return (
    <ListItem
      key={item.recordId}
      topDivider
      bottomDivider
      onLongPress={onLongPress(item)}
      containerStyle={$recordListItemContainer}
    >
      <Avatar
        rounded
        icon={iconMap[item.recordType] && icon}
        containerStyle={{ backgroundColor }}
      />
      <ListItem.Content>
        <ListItem.Title>
          <View style={$recordListItemTitleContainer}>
            <Text style={[$recordListItemTitle, { color: titleColor }]}>{title}</Text>
          </View>
        </ListItem.Title>
        <ListItem.Subtitle style={$recordListSubtitle}>
          {item.lockDateDescribe.slice(11)} {item.recordTypeDescribe}{" "}
          {item.recordType === 4 && item.keyboardPwd.slice(0, item.keyboardPwd.length - 3) + "*** "}
          {/* {item.recordType === 4 && item.keyboardPwd + " "} */}
          {item.success === 0 && "failed"}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export const RecordsScreen: FC<any> = observer(function RecordsScreen(props) {
  const {
    recordStore: { recordListAndIndices: { indices, recordList }, isRefreshing, saveLockId, getRecordList, removeAllRecordsFromStore, uploadRecords, deleteRecord, deleteAllRecords, exportExcel }
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
            style={overflowMenu}
            OverflowIcon={<FeatherIcons name="more-vertical" size={23} color="white" />}
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
                          const res = await deleteAllRecords()
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

  const getRecordListByRecordType = useCallback(async (recordType: number) => {
    setOptionsVisible(false)
    Keyboard.dismiss()
    const res = await getRecordList(undefined, recordType, 1)
    scrollView.current?.scrollToOffset(0)
  }, [])

  return (
    <>
      <Text style={$tip}>
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
        onClear={() => setOptionsVisible(true)}
        onKeyPress={() => setOptionsVisible(false)}
        onCancel={() => setOptionsVisible(false)}
        onKeyboardHide={() => setOptionsVisible(false)}
        onSubmitEditing={async () => {
          setOptionsVisible(false)
          const res = await getRecordList(searchText, undefined, 1)
          scrollView.current?.scrollToOffset(0)
        }}
      />
      {optionsVisible && (
        <View style={$optionsContainer}>
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(1)}
            containerStyle={$buttonContainer}
            title="Unlock with App"
          />
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(11)}
            containerStyle={$buttonContainer}
            title="Lock with App"
          />
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(7)}
            containerStyle={$buttonContainer}
            title="IC"
          />
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(4)}
            containerStyle={$buttonContainer}
            title="Passcode"
          />
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(8)}
            containerStyle={$buttonContainer}
            title="Fingerprint"
          />
          <Button
            type="outline"
            size="sm"
            onPress={() => getRecordListByRecordType(55)}
            containerStyle={$buttonContainer}
            title="Remote"
          />
        </View>
      )}
      <Screen preset="fixed" contentContainerStyle={$screenContentContainer}>
        <FlashList
          ref={scrollView}
          // keyExtractor={(_, i) => i + ""}
          estimatedItemSize={Platform.OS === "ios" ? 68 : 74}
          data={recordList}
          stickyHeaderIndices={indices}
          onEndReached={() => recordList.length > 0 && getRecordList(searchText)} // FlashList bug: execute onEndReached function if the list is empty on 1st launching
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => getRecordList(searchText, undefined, 1)}
            />
          }
          ListEmptyComponent={
            <View style={$EmptyComponentContainer}>
              <View style={$EmptyComponent}>
                <Image resizeMode="center" source={noData} style={$emptyImage} />
                <Text style={$emptyText}>No Data</Text>
              </View>
            </View>
          }
          renderItem={({ item, index }) => {
            if (indices.includes(index)) {
              return (
                <Text style={$stickyHeader} key={index}>
                  {item.title}
                </Text>
              )
            }
            return <RecordListItem item={item} onLongPress={fireDeleteAlert} />
          }}
          contentContainerStyle={$contentContainer}
        />
        <Dialog
          isVisible={visible}
          onBackdropPress={() => setVisible((v) => !v)}
          overlayStyle={$dialogOverlay}
          style={$dialogContainer}
        >
          <Dialog.Title title="Export records" titleStyle={$dialogTitle} />
          <Text style={$dialogTip}>You can export records of the last half year.</Text>
          <Dialog.Title title="Select time period" titleStyle={$dialogSelectTime} />
          <View style={$dialogTimePeriodContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                setDate(new Date(`${startDate}`))
                setDateVisible(true)
                setIsStart(true)
              }}
            >
              <View style={$dialogTimePeriod}>
                <Text>{startDate}</Text>
                <Text> </Text>
                <Icon name="sort-down" size={16} />
              </View>
            </TouchableWithoutFeedback>
            <FeatherIcons name="minus" size={16} />
            <TouchableWithoutFeedback
              onPress={() => {
                setDate(new Date(`${endDate}`))
                setDateVisible(true)
                setIsStart(false)
              }}
            >
              <View style={$dialogTimePeriod}>
                <Text>{endDate}</Text>
                <Text> </Text>
                <Icon name="sort-down" size={16} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Divider />
          <Dialog.Button
            titleStyle={$dialogButton}
            onPress={async () => {
              setVisible(false)
              const res = await exportExcel(
                new Date(`${startDate} 00:00:00`).getTime(),
                new Date(`${endDate} 23:59:59`).getTime(),
              )
              if (res) props.navigation.navigate("Exported Result")
            }}
          >
            Export
          </Dialog.Button>
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

const $recordListItemContainer: ViewStyle = {
  width: "100%",
}

const $recordListItemTitleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minWidth: 260,
}

const $recordListItemTitle: TextStyle = {
  fontSize: 18,
}

const $recordListSubtitle: TextStyle = {
  color: colors.palette.neutral500,
  fontSize: 13,
}

const overflowMenu: ViewStyle = {
  marginHorizontal: 10,
}

const $tip: TextStyle = {
  padding: 10,
  fontSize: 13,
  color: "grey",
}

const $optionsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  flexWrap: "wrap",
  padding: 20,
  backgroundColor: colors.background,
}

const $buttonContainer: ViewStyle = {
  margin: 5,
  backgroundColor: "white",
}

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}

const $EmptyComponentContainer: ViewStyle = {
  paddingTop: 100,
}

const $EmptyComponent: ViewStyle = {
  alignItems: "center",
}

const $emptyImage: ImageStyle = {
  height: 100,
}

const $emptyText: TextStyle = {
  color: colors.palette.neutral400,
}

const $stickyHeader: TextStyle = {
  padding: 10,
  paddingLeft: 20,
  backgroundColor: "#eee",
}

const $contentContainer: ViewStyle = {
  paddingBottom: 80,
}

const $dialogContainer: ViewStyle = {
  paddingBottom: 0,
}

const $dialogOverlay: ViewStyle = {
  paddingHorizontal: 0,
  paddingBottom: 5,
  borderRadius: 10,
}

const $dialogTitle: TextStyle = {
  textAlign: "center",
  fontWeight: "normal",
  marginBottom: 20,
}

const $dialogTip: TextStyle = {
  backgroundColor: "#F0F0F0",
  padding: 10,
}

const $dialogSelectTime: TextStyle = {
  textAlign: "center",
  paddingTop: 10,
}

const $dialogTimePeriodContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  paddingBottom: 20,
}

const $dialogTimePeriod: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  borderWidth: 1,
  borderRadius: 5,
  padding: 5,
  borderColor: "lightgrey",
}

const $dialogButton: TextStyle = {
  fontSize: 20,
}
