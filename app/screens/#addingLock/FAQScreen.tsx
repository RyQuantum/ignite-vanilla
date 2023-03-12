import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { Text, Screen } from "../../components"
import { spacing } from "../../theme"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

export const FAQScreen: FC = observer(function FAQScreen(_props) {
  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text preset="subheading">How to ADD a Smart Lock?</Text>
      <DemoDivider size={20} />
      <Text size="xs">
        To ADD / PAIR a new Lock please follow the steps below:
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        1. ACTIVATE the Smart Lock by pressing any key on the Keypad.
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        2. On your Application you will SEE a + Sign on the ADD LOCK Interface (This sign is visible for 5 - 10 seconds only, so you will need to be quick or repeat the above step)
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        3. Press the + Sign to ADD the Lock.
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        Note: If you dont see the + Sign then that Lock has already been PAIRED to another Phone / Account and cannot be PAIRED to your Phone. You will need to get the previous Owner to TRANSFER the Lock to your Account or DELETE the Lock from his Account. Also, remember your Phone needs to be connected to the Internet (3G/4G/WiFi) when Adding / Pairing a new Lock.
      </Text>
      <DemoDivider size={32} />
      <Text size="xs">
        Below are some possible reasons If you are unable to ADD or PAIR a Lock:
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        1. The Lock is not nearby or "Active"
      </Text>
      <DemoDivider size={6} />
      <Text size="xs">
        The Lock is not within 1 meter of the phone or the Bluetooth is turned OFF on your Phone.
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        2. The Lock is PAIRED to another Phone / Account
      </Text>
      <DemoDivider size={6} />
      <Text size="xs">
        Please ask the previous Owner to DELETE the Lock from his Phone / Account using the Application.
      </Text>
      <DemoDivider size={12} />
      <Text size="xs">
        3. You may have used an incorrect method to "Activate" the Smart Lock
      </Text>
      <DemoDivider size={6} />
      <Text size="xs">
        Some of the earlier Locks cannot be ADDED or PAIRED by just Activating the Lock using the Keypad. On those Locks you will need to REMOVE a Battery and REINSERT it and PRESS the # Key until you hear 2 sounds "DiDI". Once you hear this sound you will see the + Sign to ADD / PAIR the Lock.
      </Text>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}
