import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { Alert, BackHandler, TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import Video from 'react-native-video';
import { Ttlock } from "react-native-ttlock"
import { useStores } from "../../models"
import { Screen, Text } from "../../components"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { spacing } from "../../theme"

const video = require("../../../assets/videos/fingerprint.mp4")
export const LearnFingerprintScreen: FC<any> = observer(function LearnFingerprintScreen(props) {
  const {
    fingerprintStore: { uploadFingerprint, lockId },
    lockStore: { lockList }
  } = useStores()

  const player = useRef(null)
  const [paused, setPaused] = useState(true)

  const [isRunning, setIsRunning] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [count, setCount] = useState(0)

  const lock = lockList.find(l => l.lockId === lockId)!

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Fingerprint",
      headerLeft: () => null,
      gestureEnabled: false
    })
    addFingerprint()

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
    return () => {
      backHandler.remove()
      setIsRunning(false)
    }
  }, [])

  const addFingerprint = useCallback(() => {
    Ttlock.addFingerprint(null, 0, 0, lock.lockData, (currentCount, totalCount) => {
      console.log("currentCount", currentCount, "totalCount", totalCount)
      if (currentCount === 0) {
        setIsConnecting(true)
      } else {
        setPaused(false)
        setTimeout(() => setPaused(true), 750)
        setCount((count) => count + 1)
      }
    }, (fingerprintNumber) => {
      console.log("fingerprintNumber", fingerprintNumber)
      setPaused(false)
      setCount(4)
      alert(`success - fingerprintNumber: ${fingerprintNumber}`)
    }, (errorCode, errorDesc) => {
      console.log("err", errorCode, errorDesc)
      setIsConnecting(false)
      player.current.seek(0)
      setCount(0)
      isRunning && addFingerprint()
    })
  }, [])

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <DemoDivider />
      {isConnecting ? (
        <Text style={$text}>Place your Finger on the Sensor</Text>
      ) : (
        <Text style={$text}>Connecting with Lock. Please wait...</Text>
      )}
      <Text style={$text}>({count}/4)</Text>
      <Video
        source={video} // Can be a URL or a local file.
        ref={player} // Store reference
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onError={this.videoError}               // Callback when video cannot be loaded
        // repeat
        paused={paused}
        style={$backgroundVideo}
      />
      <DemoDivider size={16} />
      <Text style={$text}>
        Follow the prompts... You will be required to Place and Remove your Finger from the Sensor 4
        Times - Please be Patient.
      </Text>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  // justifyContent: "space-between",
  // alignItems: "center",
  height: "100%",
}

const $text: TextStyle = {
  textAlign: "center"
}

const $backgroundVideo: ViewStyle = {
  height: 300
}
