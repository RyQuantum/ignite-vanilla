import React, { Component } from "react"
import { ViewStyle } from "react-native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BluetoothState, ScanLockModal, Ttlock } from "react-native-ttlock"
import Spinner from "react-native-loading-spinner-overlay"
import { ListItem, Screen } from "../../components"
import { colors, spacing } from "../../theme"


type RootStackParamList = {
  "Assign Name": { lockName: string };
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
      // scanLockModal.lockMac === "D2:F2:9B:92:5E:D5" &&
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
              textStyle={{ color: colors.palette.neutral400 }}
              bottomSeparator
              leftIcon="lock"
              rightIcon="exclamation"
              // TODO LeftComponent={
              //   <View style={$logoContainer}>
              //     <Image source={reactNativeRadioLogo} style={$logo} />
              //   </View>
              // }
              key={index}
            /> :
            <ListItem
              text={lockName}
              bottomSeparator
              leftIcon="lock"
              rightIcon="plus"
              // TODO LeftComponent={
              //   <View style={$logoContainer}>
              //     <Image source={reactNativeRadioLogo} style={$logo} />
              //   </View>
              // }
              key={index}
              onPress={() => {
                Ttlock.stopScan()
                this.setState({ isLoading: true })
                Ttlock.initLock({ lockMac, lockVersion }, (lockData) => {
                  console.log(lockData)
                  this.setState({ isLoading: false })
                  this.props.navigation.navigate("Assign Name", { lockName })
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

// export const NearbyLocksScreen: FC<any> = observer(function NearbyLocksScreen(props) {
//   const [isLoading, setIsLoading] = useState(false)
//   const [lockList, setLockList] = useState<ScanLockModal[]>([])
//
//   const callback = useCallback((scanLockModal: ScanLockModal) => {
//     console.log(scanLockModal)
//     setLockList((preList) => {
//       const index = preList.findIndex((lock) => lock.lockMac === scanLockModal.lockMac)
//       if (index === -1) {
//         preList.push(scanLockModal)
//         if (!scanLockModal.isInited)
//           scanLockModal.timeout = setTimeout(() => {
//             setLockList((list) => list.filter(lock => lock.lockMac !== scanLockModal.lockMac))
//           }, 3000)
//       } else {
//         clearTimeout(preList[index].timeout)
//         if (!scanLockModal.isInited) {
//           scanLockModal.timeout = setTimeout(() => {
//             setLockList((list) => list.filter(lock => lock.lockMac !== scanLockModal.lockMac))
//           }, 3000)
//         }
//         preList[index] = scanLockModal
//       }
//       return [...preList]
//     })
//   }, [])
//
//   useEffect(() => {
//     Ttlock.getBluetoothState((state: BluetoothState) => {
//       console.log("bluetooth:", state);
//       Ttlock.startScan(callback);
//     });
//     return () => Ttlock.stopScan()
//   }, [])
//
//   return (
//     <Screen
//       preset="scroll"
//       // safeAreaEdges={["top", "bottom"]}
//       contentContainerStyle={$screenContentContainer}
//     >
//       <Spinner visible={isLoading} />
//       {lockList.map((lock, index) => {
//         const { lockMac, lockVersion, lockName, isInited } = lock
//         return isInited ?
//           <ListItem
//             text={lockName}
//             textStyle={{ color: colors.palette.neutral400 }}
//             bottomSeparator
//             leftIcon="lock"
//             rightIcon="exclamation"
//             // TODO LeftComponent={
//             //   <View style={$logoContainer}>
//             //     <Image source={reactNativeRadioLogo} style={$logo} />
//             //   </View>
//             // }
//             key={index}
//             onPress={() => {}}
//           /> :
//           <ListItem
//             text={lockName}
//             bottomSeparator
//             leftIcon="lock"
//             rightIcon="plus"
//             // TODO LeftComponent={
//             //   <View style={$logoContainer}>
//             //     <Image source={reactNativeRadioLogo} style={$logo} />
//             //   </View>
//             // }
//             key={index}
//             onPress={() => {
//               Ttlock.stopScan()
//               setIsLoading(true)
//               Ttlock.initLock({ lockMac, lockVersion }, (lockData) => {
//                 console.log(lockData)
//                 setIsLoading(false)
//                 props.navigation.navigate("Assign Name", { lockName })
//               }, (err, errMessage) => {
//                 alert(errMessage) // TODO complete the title and body format
//                 console.log(err, errMessage)
//                 setIsLoading(false)
//                 Ttlock.startScan(callback);
//               })
//             }}
//           />
//       })}
//     </Screen>
//   )
// })

const $screenContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  height: "100%",
}
