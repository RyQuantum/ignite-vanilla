import React, { FC, useEffect, useRef, useState } from "react"
import { Observer, observer } from "mobx-react"
import { Avatar, ListItem, SearchBar } from "react-native-elements"
import { FlatList, Image, ImageStyle, RefreshControl, Text, TextStyle, View, ViewStyle } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { Button, Screen } from "../../components"
import { convertTimeStamp, convertTimeStampToDate } from "../../utils/ttlock2nd"
import { fire } from "react-native-alertbox"

const noData = require("../../../assets/images/noData2nd.png")

function getValidity(fingerprint) {
  const currentTime = Date.now()
  switch (fingerprint.fingerprintType) {
    case 1:
      if (fingerprint.startDate === 0 && fingerprint.endDate === 0) { // Permanent
        return ""
      }
      // Timed
      return fingerprint.startDate > currentTime ? "Inactive" : (fingerprint.endDate + 60000 < currentTime ? "Invalid" : "") // TODO check whether others need to plus this 60000
    case 4: // Recurring
      const startDate = new Date(fingerprint.startDate).toLocaleDateString("en-CA")
      const endDate = new Date(fingerprint.endDate).toLocaleDateString("en-CA")
      const currentDate = new Date().toLocaleDateString("en-CA")
      return currentDate < startDate ? "Inactive" : currentDate > endDate ? "Invalid" : ""
    default:
      return `Invalid fingerprintType: ${fingerprint.fingerprintType}`
  }
}

function generateFingerprintInfo(fingerprint) {
  switch (fingerprint.fingerprintType) {
    case 1:
      if (fingerprint.startDate === 0 && fingerprint.endDate === 0) { // Permanent
        return convertTimeStamp(fingerprint.createDate) + " Permanent"
      }
      // Timed
      return `${convertTimeStamp(fingerprint.startDate)} - ${convertTimeStamp(fingerprint.endDate)} Timed`
    case 4: // Recurring
      return `${convertTimeStampToDate(fingerprint.startDate)} - ${convertTimeStampToDate(fingerprint.endDate)} Recurring`
    default:
      return `Invalid fingerprintType: ${fingerprint.fingerprintType}`
  }
}

export const FingerprintsScreen: FC<any> = observer(function FingerprintsScreen(props) {
  const {
    fingerprintStore: { fingerprintList, isRefreshing, saveLockId, getFingerprintList, removeAllFingerprintsFromStore, deleteFingerprint, clearAllFingerprints }
  } = useStores()

  const [searchText, setSearchText] = useState<string>("")
  const refreshRef = useRef(true)

  useEffect(() => {
    removeAllFingerprintsFromStore() // clean fingerprint store at the beginning
    saveLockId(props.route.params.lockId)
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          {/* <OverflowMenu // TODO for adding fingerprint by gateway */}
          {/*   style={{ marginHorizontal: 10 }} */}
          {/*   OverflowIcon={({ color }) => <MaterialIcons name="more-vert" size={23} color="white" />} */}
          {/* > */}
          {/*   <HiddenItem title="hidden1" onPress={() => alert('hidden1')} /> */}
          {/*   <HiddenItem title="hidden2" onPress={() => alert('hidden2')} /> */}
          {/* </OverflowMenu> */}
          <Item
            title="Reset"
            buttonStyle={$resetButton}
            onPress={() =>
              fire({
                title: "ALL Fingerprints for this Lock will be DELETED",
                actions: [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: async () => {
                      const res = await clearAllFingerprints()
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
    const unsubscribe = props.navigation.addListener('focus', () => { // auto refresh after delete a fingerprint
      if (refreshRef.current) {
        getFingerprintList()
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
          data={fingerprintList}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={getFingerprintList} />}
          renderItem={({ item, index }) => {
            const fingerprintId = item.fingerprintId
            return (
              <Observer>
                {() => (
                  <ListItem
                    topDivider
                    bottomDivider
                    onPress={() => props.navigation.navigate("Fingerprint Info", { fingerprintId })}
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
                              const res = await deleteFingerprint(item.fingerprintId)
                              // if (res) this.props.navigation.goBack()
                            },
                          },
                        ],
                        fields: [],
                      })
                    }
                    containerStyle={$listItemContainer}
                  >
                    <Avatar
                      rounded
                      icon={{
                        name: "fingerprint",
                        type: "material-community",
                        color: "white",
                        size: 26,
                      }}
                      containerStyle={$avatarContainer}
                    />
                    <ListItem.Content>
                      <ListItem.Title>
                        <View style={$titleContainer}>
                          <Text style={$title}>{item.fingerprintName}</Text>
                          <Text style={$validity}>{getValidity(item)}</Text>
                        </View>
                      </ListItem.Title>
                      <ListItem.Subtitle style={$info}>
                        {generateFingerprintInfo(item)}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                )}
              </Observer>
            )
          }}
          ListEmptyComponent={
            <View style={$emptyComponentContainer}>
              <Image resizeMode="center" source={noData} style={$image} />
              <Text style={$emptyComponentText}>No Data</Text>
            </View>
          }
          contentContainerStyle={$contentContainer}
        />
        <View style={$buttonContainer}>
          <Button
            preset="filled"
            style={$button}
            textStyle={$buttonText}
            LeftAccessory={(props) => (
              <MaterialCommunityIcons
                style={props.style}
                color="skyblue"
                size={28}
                name="plus-circle"
              />
            )}
            onPress={() =>
              props.navigation.navigate("Add Fingerprint", {
                // lockId: props.route.params.lockId,
                refreshRef,
              })
            }
          >
            Add Fingerprint
          </Button>
        </View>
      </Screen>
    </>
  )
})

const $resetButton: TextStyle = {
  color: "white",
}

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}

const $listItemContainer: ViewStyle = {
  width: "100%",
}

const $avatarContainer: ViewStyle = {
  backgroundColor: "skyblue",
}

const $titleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minWidth: 260,
}

const $title: TextStyle = {
  fontSize: 18,
}

const $validity: TextStyle = {
  color: "red",
}

const $info: TextStyle = {
  color: colors.palette.neutral300,
  fontSize: 13,
}

const $emptyComponentContainer: ViewStyle = {
  height: 400,
  justifyContent: "center",
  alignItems: "center",
}

const $image: ImageStyle = {
  height: 100,
}

const $emptyComponentText: TextStyle = {
  color: colors.palette.neutral400,
}

const $contentContainer: ViewStyle = {
  paddingBottom: 80,
}

const $buttonContainer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  backgroundColor: colors.background,
}

const $button: ViewStyle = {
  margin: 10,
  borderRadius: 10,
  backgroundColor: "white",
  height: 60,
}

const $buttonText: TextStyle = {
  color: "skyblue",
}
