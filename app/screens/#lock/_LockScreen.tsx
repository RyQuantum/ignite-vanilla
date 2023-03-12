import React, { Component } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
import { Text, Screen } from "../../components"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FeatherIcons from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors, spacing } from "../../theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { RootStoreContext } from "../../models"
import { observer } from "mobx-react"
import { parseFeatureValueWithIndex } from "../../utils/ttlock2nd"

const UnlockImage = require("../../../assets/images/UnlockImageIcon2nd.png")
const RemoteUnlockImage = require("../../../assets/images/remoteUnlock2nd.png")
const ForbidUnlockImage = require("../../../assets/images/forbidUnlock2nd.png")

type RootStackParamList = {
  // "Assign Name": { lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
}

@observer
export class LockHomeScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  declare context: React.ContextType<typeof RootStoreContext>
  state: IState = {
    // lockInfo: this.props.route.params.lock,
    // lockIndex: this.props.route.params.lockIndex,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {
    // this.setState({ lockInfo: this.props.route.params.lock })
  }

  componentWillUnmount() {
  }

  render() {
    const { lockStore: { locks, unlockOperation, lockOperation } } = this.context
    const lock = locks.find((lock) => lock.lockId === this.props.route.params.lockId) // TODO move to store
    const { lockId, lockAlias, electricQuantity, featureValue, userType, keyRight, startDate, endDate } = lock
    const isSupportFingerprint = parseFeatureValueWithIndex(featureValue, 2)
    const isSupportRemoteUnlock = parseFeatureValueWithIndex(featureValue, 10)
    const isSupportRemoter = parseFeatureValueWithIndex(featureValue, 24)
    const isAdmin = userType === "110301"
    const isNormalUser = userType === "110302" && keyRight === 0
    const isAuthorizedAdmin = userType === "110302" && keyRight === 1
    const dayLeft = (startDate === 0 && endDate === 0) ? Infinity : Math.floor((endDate - Date.now()) / 1000 / 3600 / 24)

    return (
      <>
        {dayLeft !== Infinity && dayLeft >= 0 && dayLeft < 16 && (
          <View
            style={{
              height: 30,
              width: "100%",
              backgroundColor: "blanchedalmond",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="xxs" style={{ color: "darkgoldenrod" }}>
              This eKey will expire in {dayLeft} day(s)
            </Text>
          </View>
        )}
        <Screen
          preset="scroll"
          // safeAreaEdges={["top", "bottom"]}
          contentContainerStyle={$screenContentContainer}
        >
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ width: "15%" }} />
              <Text style={$lockName}>{lockAlias}</Text>
              <View style={$batteryContainer}>
                <Text>{electricQuantity}%</Text>
                <Text> </Text>
                {electricQuantity >= 90 && <Ionicons name="battery-full-sharp" size={20} />}
                {electricQuantity > 0 && electricQuantity < 90 && (
                  <Ionicons name="battery-half-sharp" size={20} />
                )}
                {electricQuantity === 0 && <Ionicons name="battery-dead" size={20} />}
              </View>
            </View>
            {isAuthorizedAdmin && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 6,
                }}
              >
                <FeatherIcons name="user-check" size={16} color="darkgrey" />
                <Text style={{ color: "darkgrey", paddingLeft: 4 }} size="xxs">
                  Authorized Admin
                </Text>
              </View>
            )}
          </View>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end" }}
            >
              <View style={{ width: 35 }} />
              {dayLeft >= 0 ?
                <TouchableWithoutFeedback onPress={async () => {
                  const res = await unlockOperation(lockId)
                }} onLongPress={async () => {
                  const res = await lockOperation(lockId)
                }}><Image source={UnlockImage} style={$image} resizeMode="contain" /></TouchableWithoutFeedback> :
                <Image source={ForbidUnlockImage} style={$image} resizeMode="contain" />}
              {isSupportRemoteUnlock && dayLeft >= 0 ? (
                <Image source={RemoteUnlockImage} style={$remoteUnlockImage} resizeMode="contain" />
              ) : (
                <View style={{ width: 35 }} />
              )}
            </View>
            <DemoDivider size={24} />
            <Text size="sm" style={$unlockText}>
              {dayLeft >= 0 ? "Touch to unlock, hold to lock" : "You eKey has EXPIRED"}
            </Text>
          </View>
          <DemoDivider size={24} />
          <View style={$separatorTop}>
            {isNormalUser || (
              <>
                <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
                  <View style={$iconTile}>
                    <MaterialCommunityIcons
                      name="key-chain-variant"
                      color={dayLeft >= 0 ? colors.tint : colors.border}
                      size={35}
                    />
                    <Text size="xs" style={$iconTileLabel}>
                      eKeys
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => this.props.navigation.navigate("Passcodes", { lockId })}>
                  <View style={$iconTile}>
                    <Ionicons name="keypad" color={dayLeft >= 0 ? colors.tint : colors.border} size={35} />
                    <Text size="xs" style={$iconTileLabel}>
                      Passcodes
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
                  <View style={$iconTile}>
                    <MaterialCommunityIcons
                      name="credit-card-wireless"
                      color={dayLeft >= 0 ? colors.tint : colors.border}
                      size={35}
                    />
                    <Text size="xs" style={$iconTileLabel}>
                      Cards
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                {isSupportFingerprint && (
                  <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
                    <View style={$iconTile}>
                      <MaterialCommunityIcons name="fingerprint" color={dayLeft >= 0 ? colors.tint : colors.border} size={35} />
                      <Text size="xs" style={$iconTileLabel}>
                        Fingerprints
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                {isSupportRemoter && <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
                  <View style={$iconTile}>
                    <MaterialCommunityIcons name="remote" color={dayLeft >= 0 ? colors.tint : colors.border} size={35} />
                    <Text size="xs" style={$iconTileLabel}>
                      Remote
                    </Text>
                  </View>
                </TouchableWithoutFeedback>}
                {isAdmin && <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
                  <View style={$iconTile}>
                    <FeatherIcons name="user-check" color={dayLeft >= 0 ? colors.tint : colors.border} size={35} />
                    <Text size="xs" style={$iconTileLabel}>
                      Authorized Admin
                    </Text>
                  </View>
                </TouchableWithoutFeedback>}
              </>
            )}
            <TouchableWithoutFeedback disabled={dayLeft < 0} onPress={() => console.log("touch")}>
              <View style={$iconTile}>
                <MaterialCommunityIcons name="history" color={dayLeft >= 0 ? colors.tint : colors.border} size={35} />
                <Text size="xs" style={$iconTileLabel}>
                  Records
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("touch")}>
              <View style={$iconTile}>
                <Ionicons name="settings" color={colors.tint} size={35} />
                <Text size="xs" style={$iconTileLabel}>
                  Settings
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <DemoDivider size={24} />
        </Screen>
      </>
    )
  }
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
  height: "100%",
}

const $lockName: TextStyle = {
  alignSelf: "center",
  width: "70%",
  textAlign: "center"
}

const $image: ImageStyle = {
  width: 150,
  height: 150,
  // width: "100%",
}

const $remoteUnlockImage: ImageStyle = {
  width: 35,
  height: 35,
  // width: "100%",
}

const $unlockText: TextStyle = {
  color: colors.palette.neutral500,
  textAlign: "center",
}

const $iconTile: ViewStyle = {
  width: "25%",
  alignItems: "center",
  paddingVertical: spacing.extraSmall,
}

const $iconTileLabel: TextStyle = {
  marginTop: spacing.tiny,
  color: colors.textDim,
  textAlign: "center",
}

const $separatorTop: ViewStyle = {
  borderTopWidth: 1,
  borderTopColor: colors.separator,
  paddingTop: 30,
  flexDirection: "row",
  width: "100%",
  flexWrap: "wrap",
}
const $batteryContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "15%",
}
