import React, { Component } from "react"
import { View, ViewStyle, BackHandler, TextStyle } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { CustomButton, Screen, Text, TextField } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"
import { RootStoreContext } from "../../models"
import { observer } from "mobx-react"

type RootStackParamList = {
  "Assign Name": { lockName: string, lockId: number };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  lockAlias: string
  lockId: number
}

@observer
export class AssignNameScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  declare context: React.ContextType<typeof RootStoreContext>
  state: IState = {
    // lockData: this.props.route.params.lockData,
    lockAlias: this.props.route.params.lockName,
    lockId: this.props.route.params.lockId,
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  render() {
    const { lockStore: { rename } } = this.context

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
            value={this.state.lockAlias}
            onChangeText={(lockAlias) => this.setState({ lockAlias })}
            autoCapitalize="none"
            containerStyle={$textField}
          />
        </View>
        <DemoDivider size={24} />
        <CustomButton
          onPress={async () => {
            await rename(this.state.lockId, this.state.lockAlias)
            this.props.navigation.reset({
              index: 1,
              routes: [{ name: 'Adding' }],
            })
          }}
        >
          OK
        </CustomButton>
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
