import React, { FC, useCallback, useEffect } from "react"
import { RefreshControl, TouchableWithoutFeedback, ScrollView, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { observer } from "mobx-react"
import { Screen, LockCard, AutoImage, Text } from "../../components"
import { useStores } from "../../models"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { fire } from "react-native-alertbox"
import { SimpleAccordion } from "react-native-simple-accordion"

const PlusImage = require("../../../assets/images/plus.jpeg")

export const LocksScreen: FC<any> = observer(function LocksScreen(props) {
  const { lockStore: { lockGroups, isRefreshing, getKeyList, verifyPassword, deleteLock } } = useStores()

  useEffect(() => {
    getKeyList()
  }, [])

  const warnUser = useCallback((keyId) =>
    fire({ // TODO complete this part for auth admin
      title: "Delete this Lock?",
      actions: [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            fire({
              title: "Please enter the Application Password",
              actions: [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async (data) => {
                    const res = await verifyPassword(data.password)
                    if (res) {
                      await deleteLock(keyId)
                    }
                  },
                },
              ],
              fields: [
                {
                  name: "password",
                  placeholder: "Password",
                },
              ],
            })
          },
        },
      ],
      fields: [],
    }), [])

  let content
  switch (lockGroups.size) {
    case 0:
      content = (
        <>
          <DemoDivider size={100} />
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate("Adding", {
                screen: "Tutorial",
              })
            }
          >
            <AutoImage
              style={$image}
              source={PlusImage}
            />
          </TouchableWithoutFeedback>
          <DemoDivider size={100} />
          <Text size="xs" style={$text}>
            The Phone needs to be within 2 meters of the Smart Lock during the Pairing process.
          </Text>
        </>
      )
      break
    case 1:
      if (lockGroups.get(undefined)) {
        content = lockGroups
          .get(undefined)
          .locks.map((lock) => (
            <LockCard
              key={lock.lockMac}
              {...lock}
              onPress={() => props.navigation.navigate("Lock Details", { lockId: lock.lockId })}
              onLongPress={() => warnUser(lock.keyId)}
            />
          ))
      } else {
        const lockListObj = Array.from(lockGroups.values())[0]
        content = (
          <SimpleAccordion
            startCollapsed={false}
            showContentInsideOfCard={false}
            viewInside={lockListObj.locks.map((lock) => (
              <LockCard
                key={lock.lockMac}
                {...lock}
                onPress={() =>
                  props.navigation.navigate("Lock Details", { lockId: lock.lockId })
                }
                onLongPress={() => warnUser(lock.keyId)}
              />
            ))}
            title={lockListObj.groupName}
          />
        )
      }
      break
    default:
      content = Array.from(lockGroups.values()).reverse().map((lockGroup, i) => (
          <SimpleAccordion
            startCollapsed={false}
            showContentInsideOfCard={false}
            key={i}
            viewInside={lockGroup.locks.map((lock) => (
              <LockCard
                key={lock.lockMac}
                {...lock}
                onPress={() =>
                  props.navigation.navigate("Lock Details", { lockId: lock.lockId })
                }
                onLongPress={() => warnUser(lock.keyId)}
              />
            ))}
            title={lockGroup.groupName || "Ungrouped"}
          />
        ),
      )
  }

  return (
    <Screen
      preset="fixed"
      // safeAreaEdges={["bottom"]}
      // contentContainerStyle={$screenContentContainer}
    >
      <ScrollView
        style={$contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getKeyList} />
        }>
        {content}
      </ScrollView>
    </Screen>
  )
})

const $image: ImageStyle = {
  width: 160,
  height: 160,
  alignSelf: "center",
}

const $text: TextStyle = {
  textAlign: "center",
}

const $contentContainer: ViewStyle = {
  height: "100%",
}
