import React, { Component } from "react"
import { View, ViewStyle, ImageStyle } from "react-native"
import { observer } from "mobx-react"
import { Screen } from "../../components"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStoreContext } from "../../models"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
// import { ListItem } from "@rneui/themed"
import { ListItem } from "react-native-elements"

// const PlusImage = require("../../../assets/images/plus.jpeg")

type RootStackParamList = {
  // "Assign Name": { lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  // name: string
  // isLoading: boolean
}

@observer
export class RecordsScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    searchText: "",
    // lockList: [],
    // isLoading: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  render() {
    const {
      lockStore: { lockList, lockGroups, isLoading },
    } = this.context


    return (
      <Screen
        preset="scroll"
        // safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          <ListItem topDivider bottomDivider>
            <Icon size={20} name="clock-time-three-outline" />
            <ListItem.Title>1111-11-11 11:11:11 Unlocked</ListItem.Title>
          </ListItem>
          <ListItem topDivider bottomDivider>
            <Icon size={20} name="clock-time-three-outline" />
            <ListItem.Title>2222-22-22 22:22:22 Locked</ListItem.Title>
          </ListItem>
        </View>
      </Screen>
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
