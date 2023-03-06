import React, { Component } from "react"
import { Text, View, ViewStyle, ImageStyle, Alert } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AlertBox, fire } from 'react-native-alertbox';
import { Screen } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { RootStoreContext } from "../../models"
// import { ListItem } from "@rneui/themed"
import { ListItem } from "react-native-elements"
import moment from "moment-timezone"
// const PlusImage = require("../../../assets/images/plus.jpeg")

type RootStackParamList = {
  // "Assign Name": { lockName: string };
}

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  // name: string
  // isLoading: boolean
}

function Period({ code }) {
  return ( // TODO detect Permanent and other mode
    <View>
      <Text style={{ fontSize: 12 }}>{moment(code.startDate).format("YYYY-MM-DD HH:mm")}</Text>
      <Text style={{ fontSize: 12 }}>{moment(code.endDate).format("YYYY-MM-DD HH:mm")}</Text>
    </View>
  )
}

@observer
export class PasscodeInfoScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    searchText: "",
    // lockList: [],
    // isLoading: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      codeStore: { codes, deleteCode, updateCode },
    } = this.context
    // const code = this.props.route.params.code
    const code = codes.find(c => c.keyboardPwdId === this.props.route.params.codeId)

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          <AlertBox />
          <ListItem
            bottomDivider
            onPress={() => {
              fire({
                title: "Change password",
                actions: [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: async (data) => {
                      const res = await updateCode(code.keyboardPwdId, data.code, code.keyboardPwdName, code.startDate, code.endDate)
                    },
                  },
                ],
                fields: [
                  {
                    name: 'code',
                    placeholder: '4 - 9 Digits in length',
                    keyboardType: "number-pad"
                  },
                ],
              });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>Passcode</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>{code.keyboardPwd}</ListItem.Subtitle>
            <ListItem.Chevron />
          </ListItem>
          <ListItem
            bottomDivider
            onPress={() => {
              fire({
                title: "Edit name",
                actions: [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: (data) => console.log(data), // It is an object that holds fields data
                  },
                ],
                fields: [
                  {
                    name: 'name',
                    defaultValue: code.keyboardPwd
                  },
                ],
              });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>Name</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>{code.keyboardPwdName || code.keyboardPwd}</ListItem.Subtitle>
            <ListItem.Chevron />
          </ListItem>
          <ListItem
            bottomDivider
            onPress={() =>
              this.props.navigation.navigate("Change Period", { code })
            }
          >
            <ListItem.Content>
              <ListItem.Title>Validity Period</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>
              <Period code={code} />
            </ListItem.Subtitle>
            <ListItem.Chevron />
          </ListItem>
          <DemoDivider />
          <ListItem topDivider bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Issued by</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>{code.senderUsername}</ListItem.Subtitle>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Time Issued</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>
              {moment(code.sendDate).format("YYYY-MM-DD HH:mm")}
            </ListItem.Subtitle>
          </ListItem>
          <DemoDivider />
          <ListItem bottomDivider onPress={() => this.props.navigation.navigate("Records")}>
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
              Alert.alert("Delete?", null, [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: async () => {
                    const res = await deleteCode(code.lockId, code.keyboardPwdId)
                    if (res) this.props.navigation.goBack()
                  },
                },
              ])
            }
          >
            <ListItem.Title>Delete</ListItem.Title>
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
