import React, { FC, useCallback, useEffect, useState } from "react"
import { RefreshControl, FlatList, ViewStyle, ActivityIndicator, View } from "react-native"
import CompleteFlatList from 'react-native-complete-flatlist';
import {
  Screen,
  LockCard,
} from "../../components"
import { colors, spacing } from "../../theme"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

export const MainScreen: FC<any> = observer(function MainScreen(props) {
  const [lockList, setLockList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { authenticationStore: { getKeyList } } = useStores()


  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const list = await getKeyList()
      setLockList(list)
      setIsLoading(false)
    })()
  },[])

  return (
    <>
    <Screen
      preset="scroll"
      // safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      {isLoading ? <ActivityIndicator /> : null}
      <View>
        {lockList.map((lock, index) => <LockCard key={index} {...lock} />)}
      </View>
      {/* TODO replace to FlatList or others for performance */}
    </Screen>
      </>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
}
