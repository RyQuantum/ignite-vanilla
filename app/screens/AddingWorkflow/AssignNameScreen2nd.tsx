import React, { Component } from "react"
import { View, ViewStyle, BackHandler, TextStyle } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { CustomButton, Screen, Text, TextField } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"
import { RootStoreContext } from "../../models"


type RootStackParamList = {
  "Assign Name": { lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  name: string
}

export class AssignNameScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    lockData: this.props.route.params.lockData,
    name: this.props.route.params.lockName,
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  render() {
    const { authenticationStore: { initialize } } = this.context
    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          <Text style={$text}>Success. Assign a name</Text>
          <DemoDivider size={48} />
          <TextField
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            autoCapitalize="none"
            containerStyle={$textField}
          />
        </View>
        <DemoDivider size={24} />
        <CustomButton onPress={() => initialize(this.state.lockData, this.state.name)}>OK</CustomButton>
      </Screen>
    )
  }
}


const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.large,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
  height: "100%",
}

const $text: TextStyle = {
  alignSelf: "center"
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}
