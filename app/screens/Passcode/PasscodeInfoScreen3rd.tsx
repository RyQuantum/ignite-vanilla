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
  let keyType = ""
  switch (code.keyboardPwdType) {
    case 5:
      keyType = "Weekend"
      break
    case 6:
      keyType = "Daily"
      break
    case 7:
      keyType = "Workday"
      break
    case 8:
      keyType = "Monday"
      break
    case 9:
      keyType = "Tuesday"
      break
    case 10:
      keyType = "Wednesday"
      break
    case 11:
      keyType = "Thursday"
      break
    case 12:
      keyType = "Friday"
      break
    case 13:
      keyType = "Saturday"
      break
    case 14:
      keyType = "Sunday"
      break
    default: // TODO verify case 1 to 4
      return (
        <View>
          <Text style={{ fontSize: 12 }}>{moment(code.startDate).format("YYYY-MM-DD HH:mm")}</Text>
          <Text style={{ fontSize: 12 }}>{moment(code.endDate).format("YYYY-MM-DD HH:mm")}</Text>
        </View>
      )
  }
  return <Text style={{ fontSize: 16 }}>{keyType} {moment(code.startDate).format("HH:mm")}-{moment(code.endDate).format("HH:mm")}</Text>
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

  componentDidMount() {
    this.context.codeStore.updateCodeId(this.props.route.params.codeId)
    this.unsubscribe = this.props.navigation.addListener('focus', () => { // auto refresh after delete a code
      this.forceUpdate()
    });
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {
      codeStore: { codes, deleteCode, updateCode, updateCodeName },
    } = this.context
    // const code = this.props.route.params.code
    const code = codes.find(c => c.keyboardPwdId === this.props.route.params.codeId)
    if (!code) { // After delete the code, the code will be removed from the store immediately. So return null.
      this.props.navigation.goBack()
      return null
    }

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
            onPress={
              [1, 4].includes(code.keyboardPwdType)
                ? undefined
                : () => {
                    fire({
                      title: "Change passcode",
                      actions: [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: async (data) => {
                            const res = await updateCode(
                              code.keyboardPwdId,
                              data.code,
                              code.keyboardPwdName,
                              code.startDate,
                              code.endDate,
                            )
                          },
                        },
                      ],
                      fields: [
                        {
                          name: "code",
                          placeholder: "4 - 9 Digits in length",
                          keyboardType: "number-pad",
                        },
                      ],
                    })
                  }
            }
          >
            <ListItem.Content>
              <ListItem.Title>Passcode</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>{code.keyboardPwd}</ListItem.Subtitle>
            {[1, 4].includes(code.keyboardPwdType) || <ListItem.Chevron />}
          </ListItem>
          <ListItem
            bottomDivider
            onPress={() => {
              fire({
                title: "Edit name",
                actions: [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: async (data) => {
                      const res = await updateCodeName(code.keyboardPwdId, data.name)
                    },
                  },
                ],
                fields: [
                  {
                    name: "name",
                    defaultValue: code.keyboardPwdName,
                  },
                ],
              })
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
            onPress={
              [2, 3].includes(code.keyboardPwdType)
                ? () => this.props.navigation.navigate("Change Period", { code })
                : undefined
            }
          >
            <ListItem.Content>
              <ListItem.Title>Validity Period</ListItem.Title>
            </ListItem.Content>
            <ListItem.Subtitle>
              <Period code={code} />
            </ListItem.Subtitle>
            {[2, 3].includes(code.keyboardPwdType) && <ListItem.Chevron />}
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
              {moment(code.sendDate).format("YYYY-MM-DD HH:mm:ss")}
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
              Alert.alert("Delete?", undefined, [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: async () => {
                    const res = await deleteCode(code.lockId, code.keyboardPwdId)
                    // if (res) this.props.navigation.goBack()
                  },
                },
              ])
            }
          >
            <ListItem.Title style={{ color: "red" }}>Delete</ListItem.Title>
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
