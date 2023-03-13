import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { Screen } from "../../components"
import { useStores } from "../../models"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
// import { ListItem } from "@rneui/themed"
import { ListItem } from "react-native-elements"

export const RecordsScreen: FC<any> = observer(function RecordsScreen(_props) {
  const {
    lockStore: { },
  } = useStores()

  return (
    <Screen
      preset="scroll"
      // safeAreaEdges={["bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View>
        <ListItem topDivider bottomDivider>
          <Icon size={20} name="clock-time-three-outline" />
          <ListItem.Title>1111-11-11 11:11:11 Unlocked</ListItem.Title>
        </ListItem>
        <ListItem topDivider bottomDivider>
          <Icon size={20} name="clock-time-three-outline" />
          <ListItem.Title>2222-22-22 22:22:22 Locked</ListItem.Title>
        </ListItem>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  justifyContent: "space-between",
  height: "100%",
}

