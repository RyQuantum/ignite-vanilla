import React, { Component } from "react"
import { RefreshControl, TouchableWithoutFeedback, ScrollView, ViewStyle, Alert } from "react-native"
import { observer } from "mobx-react"
import { Text, LockCard, AutoImage, Screen } from "../../components"
import { spacing } from "../../theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { RootStoreContext } from "../../models"
import { SimpleAccordion } from "react-native-simple-accordion"
import { fire } from "react-native-alertbox"

const PlusImage = require("../../../assets/images/plus.jpeg")

type RootStackParamList = {
  // "Assign Name": { lockName: string };
};

interface IProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "main">;
}

interface IState {
  name: string
  // isLoading: boolean
}

@observer
export class LocksScreen extends Component<IProps, IState> {
  static contextType = RootStoreContext
  declare context: React.ContextType<typeof RootStoreContext>
  state: IState = {
    // lockList: [],
    // isLoading: false,
    // name: this.props.route.params.lockName,
  }

  componentDidMount() {
    this.loadLocks()
  }

  componentWillUnmount() {}

  loadLocks = async () => {
    // const { lockStore: { getKeyList } } = this.context
    // this.setState({ isRefreshing: true })
    await this.context.lockStore.getKeyList()
    // this.setState({ isRefreshing: false })
  }

  warnUser = (keyId) =>
// fire({ TODO complete this part for auth admin
//   title: "Are you sure you want to DELETE this delegated eKey?",
//   message: 'Type "yes" to DELETE ALL eKeys associated with this eKey. The Step cannot be UNDONE!',
//   actions: [
//     {
//       text: "Cancel",
//       style: "cancel",
//     },
//     {
//       text: "Delete",
//       onPress: async (data) => {
//         // const res = await updateCode(
//         //   code.keyboardPwdId,
//         //   data.code,
//         //   code.keyboardPwdName,
//         //   code.startDate,
//         //   code.endDate,
//         // )
//         console.log("data", data)
//       },
//     },
//   ],
//   fields: [
//     {
//       name: "text",
//     },
//   ],
// })
    fire({
      title: "Delete this Lock?",
      actions: [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (data) => {
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
                    const res = await this.context.lockStore.verifyPassword(data.password)
                    if (res) {
                      await this.context.lockStore.deleteLock(keyId)
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
    })

  render() {
    const {
      lockStore: { lockGroups, isRefreshing },
    } = this.context

    let content;
    switch (lockGroups.size) {
      case 0:
        content = (
          <>
            <DemoDivider size={100} />
            <TouchableWithoutFeedback
              onPress={() =>
                this.props.navigation.navigate("Adding", {
                  screen: "Tutorial",
                })
              }
            >
              <AutoImage
                style={{ width: 160, height: 160, alignSelf: "center" }}
                source={PlusImage}
              />
            </TouchableWithoutFeedback>
            <DemoDivider size={100} />
            <Text size="xs" style={{ textAlign: "center" }}>
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
                onPress={() => this.props.navigation.navigate("Lock Details", { lockId: lock.lockId })}
                onLongPress={() => this.warnUser(lock.keyId)}
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
                    this.props.navigation.navigate("Lock Details", { lockId: lock.lockId })
                  }
                  onLongPress={() => this.warnUser(lock.keyId)}
                />
              ))}
              title={lockListObj.groupName}
            />
          )
        }
        break
      default:
        const lockGroupList = Array.from(lockGroups.values()).reverse()
        content = lockGroupList.map((lockGroup, i) => (
          <SimpleAccordion
            startCollapsed={false}
            showContentInsideOfCard={false}
            key={i}
            viewInside={lockGroup.locks.map((lock) => (
              <LockCard
                key={lock.lockMac}
                {...lock}
                onPress={() =>
                  this.props.navigation.navigate("Lock Details", { lockId: lock.lockId })
                }
                onLongPress={() => this.warnUser(lock.keyId)}
              />
            ))}
            title={lockGroup.groupName || "Ungrouped"}
          />
        ))

    }

    return (
      <Screen
        preset="fixed"
        // safeAreaEdges={["bottom"]}
        // contentContainerStyle={$screenContentContainer}
      >
        <ScrollView
          style={{ height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={this.loadLocks} />
          }>
          {content}
        </ScrollView>
      </Screen>
    )

    // return ( // TODO backup
    //   <Screen
    //     preset="scroll"
    //     // safeAreaEdges={["top", "bottom"]}
    //     contentContainerStyle={$screenContentContainer}
    //   >
    //     {isRefreshing ? <ActivityIndicator /> : null}
    //     {/*<View>*/}
    //     {/*  {lockList.length === 0 && (*/}
    //     {/*    <>*/}
    //     {/*      <DemoDivider size={80} />*/}
    //     {/*      <TouchableWithoutFeedback*/}
    //     {/*        onPress={() =>*/}
    //     {/*          this.props.navigation.navigate("Adding", {*/}
    //     {/*            screen: "Tutorial",*/}
    //     {/*          })*/}
    //     {/*        }*/}
    //     {/*      >*/}
    //     {/*        <AutoImage*/}
    //     {/*          style={{ width: 150, height: 150, alignSelf: "center" }}*/}
    //     {/*          source={PlusImage}*/}
    //     {/*        />*/}
    //     {/*      </TouchableWithoutFeedback>*/}
    //     {/*      <DemoDivider size={80} />*/}
    //     {/*      <Text size="xs" style={{ textAlign: "center" }}>*/}
    //     {/*        The Phone needs to be within 2 meters of the Smart Lock during the Pairing process.*/}
    //     {/*      </Text>*/}
    //     {/*    </>*/}
    //     {/*  )}*/}
    //     {/*  {lockList.map((lock, index) => (*/}
    //     {/*    <LockCard key={index} {...lock} />*/}
    //     {/*  ))}*/}
    //     {/*</View>*/}
    //
    //     {/*<FlatList*/}
    //     {/*  // style={{ height: "100%", justifyContent: "flex-end" }}*/}
    //     {/*  data={lockList}*/}
    //     {/*  refreshControl={*/}
    //     {/*    <RefreshControl*/}
    //     {/*      colors={["#9Bd35A", "#689F38"]}*/}
    //     {/*      refreshing={isRefreshing}*/}
    //     {/*      onRefresh={this.loadLocks}*/}
    //     {/*    />*/}
    //     {/*  }*/}
    //     {/*  renderItem={({ item, index }) => (*/}
    //     {/*    <SimpleAccordion*/}
    //     {/*      startCollapsed={false}*/}
    //     {/*      showContentInsideOfCard={false}*/}
    //     {/*      viewInside={*/}
    //     {/*        <LockCard*/}
    //     {/*          key={index}*/}
    //     {/*          {...item}*/}
    //     {/*          onPress={() =>*/}
    //     {/*            this.props.navigation.navigate("Lock Details", { lockIndex: index })*/}
    //     {/*          }*/}
    //     {/*        />*/}
    //     {/*      }*/}
    //     {/*      title={"My Accordion Title"}*/}
    //     {/*    />*/}
    //     {/*  )}*/}
    //     {/*  ListEmptyComponent={*/}
    //     {/*    <>*/}
    //     {/*      <DemoDivider size={80} />*/}
    //     {/*      <TouchableWithoutFeedback*/}
    //     {/*        onPress={() =>*/}
    //     {/*          this.props.navigation.navigate("Adding", {*/}
    //     {/*            screen: "Tutorial",*/}
    //     {/*          })*/}
    //     {/*        }*/}
    //     {/*      >*/}
    //     {/*        <AutoImage*/}
    //     {/*          style={{ width: 150, height: 150, alignSelf: "center" }}*/}
    //     {/*          source={PlusImage}*/}
    //     {/*        />*/}
    //     {/*      </TouchableWithoutFeedback>*/}
    //     {/*      <DemoDivider size={80} />*/}
    //     {/*      <Text size="xs" style={{ textAlign: "center" }}>*/}
    //     {/*        The Phone needs to be within 2 meters of the Smart Lock during the Pairing process.*/}
    //     {/*      </Text>*/}
    //     {/*    </>*/}
    //     {/*  }*/}
    //     {/*  estimatedItemSize={200}*/}
    //     {/*/>*/}
    //   </Screen>
    // )
  }
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.medium,
  // paddingHorizontal: spacing.medium,
  // justifyContent: "space-around",
  // height: "100%",
}
