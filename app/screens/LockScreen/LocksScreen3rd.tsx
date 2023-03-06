import React, { Component } from "react"
import { RefreshControl, TouchableWithoutFeedback, ScrollView, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { Text, LockCard, AutoImage, Screen } from "../../components"
import { spacing } from "../../theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"
import { RootStoreContext } from "../../models"
import { SimpleAccordion } from "react-native-simple-accordion"

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
    // this.setState({ isLoading: true })
    await this.context.lockStore.getKeyList()
    // this.setState({ isLoading: false })
  }

  render() {
    const {
      lockStore: { lockList, lockGroups, isLoading },
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
                onPress={() => this.props.navigation.navigate("Lock Details", { lockMac: lock.lockMac })}
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
                    this.props.navigation.navigate("Lock Details", { lockMac: lock.lockMac })
                  }
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
                  this.props.navigation.navigate("Lock Details", { lockMac: lock.lockMac })
                }
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
          contentContainerStyle={{ height: "100%" }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={this.loadLocks} />
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
    //     {isLoading ? <ActivityIndicator /> : null}
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
    //     {/*      refreshing={isLoading}*/}
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
