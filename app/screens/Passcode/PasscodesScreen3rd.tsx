import React, { Component } from "react"
import { View, ViewStyle, ImageStyle, RefreshControl, FlatList, Text, Alert } from "react-native"
import { observer } from "mobx-react"
import { Screen, Button } from "../../components"
import { colors } from "../../theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStoreContext } from "../../models"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
// import { Avatar, ListItem, SearchBar } from "@rneui/themed"
import { Avatar, ListItem, SearchBar } from "react-native-elements"
import moment from "moment-timezone"

type RootStackParamList = {
  // "Assign Name": { lockName: string };
}

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  // name: string
  // isRefreshing: boolean
}

@observer
export class PasscodesScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    searchText: "",
    currentTimezone: moment.tz.guess(), // TODO unify to a single place and can be updated every time user changes the timezone without quit the app
    // lockList: [],
    // isRefreshing: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {
    this.context.codeStore.reset() // clean code store at the beginning
    this.context.codeStore.updateLockId(this.props.route.params.lockId)
    this.unsubscribe = this.props.navigation.addListener('focus', () => { // auto refresh after delete a code
      this.forceUpdate()
    });
    // this.props.navigation.setParams({ forceUpdate: this.forceUpdate }); // TODO doesn't work
    this.loadCodes()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  loadCodes = async () => {
    // const { lockStore: { getKeyList } } = this.context
    // this.setState({ isRefreshing: true })
    await this.context.codeStore.getCodeList(this.props.route.params.lockId)
    // this.setState({ isRefreshing: false })
  }

  convertTimeStamp = (timestamp: number) => {
    return moment(timestamp).tz(this.state.currentTimezone).format("YYYY.MM.DD HH:mm")
  }

  convertTimeStampWithoutTime = (timestamp: number) => {
    return moment(timestamp).tz(this.state.currentTimezone).format("YYYY.MM.DD")
  }

  parseTimeOfTimeStamp = (timestamp: number) => {
    return moment(timestamp).tz(this.state.currentTimezone).format("HH:mm")
  }

  generateCodeInfo = (code) => {
    switch (code.keyboardPwdType) {
      case 1:
        return `${this.convertTimeStamp(code.startDate)} One-time`
      case 2:
        return `${this.convertTimeStamp(code.startDate)} Permanent`
      case 3:
        return `${this.convertTimeStamp(code.startDate)} - ${this.convertTimeStamp(code.endDate)} ${code.isCustom ? "Custom" : "Timed"}`
      case 4:
        return `${this.convertTimeStamp(code.startDate)} Erase`
      case 5:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Weekend ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 6:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Daily ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 7:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Workday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 8:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Monday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 9:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Tuesday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 10:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Wednesday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 11:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Thursday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 12:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Friday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 13:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Saturday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      case 14:
        return `${this.convertTimeStampWithoutTime(code.startDate)} Sunday ${this.parseTimeOfTimeStamp(code.startDate)} - ${this.parseTimeOfTimeStamp(code.endDate)} Recurring`
      default:
        return `Invalid keyboardPwdType: ${code.keyboardPwdType}`
    }
  }

  getValidity = (code) => {
    const currentTime = Date.now()
    switch (code.keyboardPwdType) {
      case 1:
        return (code.startDate + 6 * 3600 * 1000 > currentTime) || "Invalid" // TODO verify equal or not
      case 2:
        return ""
      case 3:
        return (code.startDate < currentTime && code.endDate > currentTime) || "Invalid"
      case 4:
        return ""
      case 5:
        return [0, 6].includes(moment(currentTime).weekday()) || "Inactive"
      case 6:
        return ""
      case 7:
        return [1, 2, 3, 4, 5].includes(moment(currentTime).weekday()) || "Inactive"
      case 8:
        return moment(currentTime).weekday() === 1 || "Inactive"
      case 9:
        return moment(currentTime).weekday() === 2 || "Inactive"
      case 10:
        return moment(currentTime).weekday() === 3 || "Inactive"
      case 11:
        return moment(currentTime).weekday() === 4 || "Inactive"
      case 12:
        return moment(currentTime).weekday() === 5 || "Inactive"
      case 13:
        return moment(currentTime).weekday() === 6 || "Inactive"
      case 14:
        return moment(currentTime).weekday() === 0 || "Inactive"
      default:
        return `Invalid keyboardPwdType: ${code.keyboardPwdType}`
    }
  }

  render() {
    const {
      codeStore: { codeList, isRefreshing, deleteCode },
    } = this.context

    return (
      <>
        <SearchBar
          platform="ios"
          placeholder="Search"
          onChangeText={(searchText) => this.setState({ searchText })}
          value={this.state.searchText}
          returnKeyType="search"
          onSubmitEditing={(e) => console.log(JSON.stringify(e))}
        />
        <Screen
          preset="fixed"
          safeAreaEdges={["bottom"]}
          contentContainerStyle={$screenContentContainer}
        >
          <FlatList
            data={codeList}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this.loadCodes} />}
            renderItem={({ item, index }) => {
              const codeId = item.keyboardPwdId
              return (
                // <ListItem.Swipeable
                <ListItem
                  topDivider
                  bottomDivider
                  onPress={() => this.props.navigation.navigate("Passcode Info", { codeId })}
                  onLongPress={() => Alert.alert("Delete?", undefined, [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: async () => {
                        const res = await deleteCode(item.lockId, item.keyboardPwdId)
                        // if (res) this.props.navigation.goBack()
                      },
                    },
                  ])}
                  rightContent={ // TODO integrate swipe function for better user experience
                    <Button
                      style={{ minHeight: "100%", backgroundColor: "red" }}
                      textStyle={{ color: "white" }}
                      onPress={() => { // TODO execute item "close" function in the meanwhile of alert
                        Alert.alert("Delete?", undefined, [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "Delete",
                            onPress: () =>
                              deleteCode(this.props.route.params.lockId, item.keyboardPwdId),
                          },
                        ])
                      }}
                    >
                      Delete
                    </Button>
                  }
                  containerStyle={{ width: "100%" }}
                >
                  <Avatar
                    rounded
                    icon={{
                      name: "dots-grid",
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
                          minWidth: 260
                        }}
                      >
                        <Text style={{ fontSize: 18 }}>
                          {item.keyboardPwdName || item.keyboardPwd}
                        </Text>
                        <Text style={{ color: "red" }}>{this.getValidity(item)}</Text>
                      </View>
                    </ListItem.Title>
                    <ListItem.Subtitle style={{ color: colors.palette.neutral300, fontSize: 13 }}>
                      {this.generateCodeInfo(item)}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              // </ListItem.Swipeable>
              )
            }}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
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
                this.props.navigation.navigate("Generate Passcode", {
                  lockId: this.props.route.params.lockId,
                })
              }
            >
              Generate Passcode
            </Button>
          </View>
        </Screen>
      </>
    )
  }
}

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}

const $iconStyle: ImageStyle = { width: 30, height: 30 }
