import React, { FC, useCallback, useEffect } from "react"
import {
  ViewStyle,
  RefreshControl,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native"
import { observer } from "mobx-react"
import { Screen, LockCard, AutoImage, Text } from "../../components"
import { spacing } from "../../theme"
import { useStores } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

const PlusImage = require("../../../assets/images/plus.jpeg")

export const LocksScreen: FC<any> = observer(function LocksScreenr(props) {
  // const [lockList, setLockList] = useState([])
  // const [isLoading, setIsLoading] = useState(true)
  const { lockStore: { getKeyList, lockList, isRefreshing } } = useStores()

  const loadLockList = useCallback(() => {
    ;(async () => {
      // setIsLoading(true)
      const list = await getKeyList()
      // setLockList(list)
      // setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    loadLockList()
  },[])

  return (
    <>
      <Screen
        // preset="fixed"
        // safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={$screenContentContainer}
      >
        {/* {isRefreshing ? <ActivityIndicator /> : null} */}
        {/* <View> */}
        {/*   {lockList.length === 0 && ( */}
        {/*     <View style={{ width: "60%" }}> */}
        {/*       <AutoImage maxHeight={90} maxWidth={90} source={PlusImage} /> */}
        {/*     </View> */}
        {/*   )} */}
        {/*   {lockList.map((lock, index) => <LockCard key={index} {...lock} />)} */}
        {/* </View> */}
        <FlatList
          // style={{ height: "100%", justifyContent: "flex-end" }}
          data={lockList}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefreshing}
              onRefresh={loadLockList}
            />
          }
          renderItem={({ item }) => (
            <LockCard
              key={item.lockMac}
              {...item}
              onPress={() =>
                props.navigation.navigate("Lock Details", { lockMac: item.lockMac })
              }
            />
          )}
          ListEmptyComponent={
            <>
              <DemoDivider size={80} />
              <TouchableWithoutFeedback
                onPress={() =>
                  props.navigation.navigate("Adding", {
                    screen: "Tutorial",
                  })
                }
              >
                <AutoImage
                  style={{ width: 150, height: 150, alignSelf: "center" }}
                  source={PlusImage}
                />
              </TouchableWithoutFeedback>
              <DemoDivider size={80} />
              <Text size="xs" style={{ textAlign: "center" }}>
                The Phone needs to be within 2 meters of the Smart Lock during the Pairing process.
              </Text>
            </>
          }
          estimatedItemSize={200}
        />
      </Screen>
    </>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  paddingHorizontal: spacing.medium,
  // alignItems: "center",
  // flexDirection: "column",
  // justifyContent: "center",
  height: "100%",
}
