import React, { Component } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BluetoothState, ScanLockModal, Ttlock } from "react-native-ttlock"
import Spinner from "react-native-loading-spinner-overlay"
import { ListItem, Screen } from "../../components"
import { colors, spacing } from "../../theme"
import { RootStoreContext } from "../../models"

type RootStackParamList = {
  "Assign Name": { lockData: string, lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Assign Name">;
}

interface LockModal extends ScanLockModal {
  timeout?: NodeJS.Timeout
}

interface IState {
  isLoading: boolean;
  lockList: LockModal[];
}

export class NearbyLocksScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  state: IState = {
    isLoading: false,
    lockList: [],
  }

  componentDidMount() {
    Ttlock.getBluetoothState((state: BluetoothState) => {
      console.log("bluetooth:", state)
      this.startScan()
    })
  }

  startScan = () => {
    Ttlock.startScan((lockModal: LockModal) => {
      console.log(lockModal)
      const lockList = this.state.lockList
      const index = lockList.findIndex((lock) => lock.lockMac === lockModal.lockMac)
      if (index === -1) {
        lockList.push(lockModal)
        if (!lockModal.isInited)
          lockModal.timeout = setTimeout(() => {
            this.setState((state) => ({ lockList: state.lockList.filter(l => l.lockMac !== lockModal.lockMac) }))
          }, 3000)
      } else {
        clearTimeout(lockList[index].timeout)
        if (!lockModal.isInited) {
          lockModal.timeout = setTimeout(() => {
            this.setState((state) => ({ lockList: state.lockList.filter(l => l.lockMac !== lockModal.lockMac) }))
          }, 3000)
        }
        lockList[index] = lockModal
      }
      this.setState({ lockList })
    })
  }

  componentWillUnmount() {
    Ttlock.stopScan();
  }

  render() {
    const { lockStore: { initialize } } = this.context
    return (
      <Screen
        preset="scroll"
        // safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        <Spinner visible={this.state.isLoading} />
        {this.state.lockList.map((lock, index) => {
          const { lockMac, lockVersion, lockName, isInited } = lock
          return isInited ?
            <ListItem
              text={lockName}
              textStyle={$text}
              bottomSeparator
              leftIcon="lock"
              rightIcon="exclamation"
              key={index}
            /> :
            <ListItem
              text={lockName}
              bottomSeparator
              leftIcon="lock"
              rightIcon="plus"
              key={index}
              onPress={() => {
                Ttlock.stopScan()
                this.setState({ isLoading: true })
                Ttlock.initLock({ lockMac, lockVersion }, async (lockData) => { // TODO put the function in the lockStore
                  const res = await initialize(lockData, lockName)
                  if (res?.lockId) {
                    this.props.navigation.navigate("Assign Name", { lockData, lockName, lockId: res.lockId })
                  }
                  this.setState({ isLoading: false })
                }, (err, errMessage) => {
                  alert(errMessage) // TODO complete the title and body format
                  console.log(err, errMessage)
                  this.setState({ isLoading: false })
                  this.startScan()
                })
              }}
            />
        })}
      </Screen>
    )
  }
}

const $screenContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  height: "100%",
}

const $text: TextStyle = {
  color: colors.palette.neutral400
}
