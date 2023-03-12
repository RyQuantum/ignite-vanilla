import React, { FC, useCallback, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BluetoothState, ScanLockModal, Ttlock } from "react-native-ttlock"
import Spinner from "react-native-loading-spinner-overlay"
import { ListItem, Screen } from "../../components"
import { colors, spacing } from "../../theme"


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

export const NearbyLocksScreen: FC<any> = observer(function NearbyLocksScreen(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [lockList, setLockList] = useState<ScanLockModal[]>([])

  const callback = useCallback((scanLockModal: ScanLockModal) => {
    console.log(scanLockModal)
    setLockList((preList) => {
      const index = preList.findIndex((lock) => lock.lockMac === scanLockModal.lockMac)
      if (index === -1) {
        preList.push(scanLockModal)
        if (!scanLockModal.isInited)
          scanLockModal.timeout = setTimeout(() => {
            setLockList((list) => list.filter(lock => lock.lockMac !== scanLockModal.lockMac))
          }, 3000)
      } else {
        clearTimeout(preList[index].timeout)
        if (!scanLockModal.isInited) {
          scanLockModal.timeout = setTimeout(() => {
            setLockList((list) => list.filter(lock => lock.lockMac !== scanLockModal.lockMac))
          }, 3000)
        }
        preList[index] = scanLockModal
      }
      return [...preList]
    })
  }, [])

  useEffect(() => {
    Ttlock.getBluetoothState((state: BluetoothState) => {
      console.log("bluetooth:", state);
      Ttlock.startScan(callback);
    });
    return () => Ttlock.stopScan()
  }, [])

  return (
    <Screen
      preset="scroll"
      // safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Spinner visible={isLoading} />
      {lockList.map((lock, index) => {
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
            onPress={() => {}}
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
              setIsLoading(true)
              Ttlock.initLock({ lockMac, lockVersion }, (lockData) => {
                console.log(lockData)
                setIsLoading(false)
                props.navigation.navigate("Assign Name", { lockName })
              }, (err, errMessage) => {
                alert(errMessage) // TODO complete the title and body format
                console.log(err, errMessage)
                setIsLoading(false)
                Ttlock.startScan(callback);
              })
            }}
          />
      })}
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  height: "100%",
}

const $text: TextStyle = {
  color: colors.palette.neutral400
}
