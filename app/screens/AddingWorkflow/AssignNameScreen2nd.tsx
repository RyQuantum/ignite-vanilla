import React, { Component } from "react"
import { View, ViewStyle, BackHandler } from "react-native"
import { Button, MyButton, Screen, Text as Text2, TextField } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"

export class AssignNameScreen extends Component<any, any> {

  state = {
    name: this.props.route.params.lockName,
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  render() {
    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View>
          <Text2 style={{ alignSelf: "center" }}>Success. Assign a name</Text2>
          <DemoDivider size={48} />
          <TextField
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            autoCapitalize="none"
            containerStyle={$textField}
          />
        </View>
        <DemoDivider size={24} />
        <MyButton onPress={() => {}}>OK</MyButton>
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

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}
