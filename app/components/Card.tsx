import React, { ComponentType, Fragment, ReactElement } from "react"
import {
  Text as OriginalText,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import moment from "moment-timezone"
import { colors, spacing } from "../theme"
import { Text, TextProps } from "./Text"
import Icon from "react-native-vector-icons/Ionicons"
import { parseFeatureValueWithIndex } from "../utils/ttlock2nd"

type Presets = keyof typeof $containerPresets

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: "top" | "center" | "space-between" | "force-footer-bottom"
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps["text"]
  /**
   * Heading text which is looked up via i18n.
   */
  headingTx?: TextProps["tx"]
  /**
   * Optional heading options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  headingTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps
  /**
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps["text"]
  /**
   * Content text which is looked up via i18n.
   */
  contentTx?: TextProps["tx"]
  /**
   * Optional content options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  contentTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps
  /**
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps["text"]
  /**
   * Footer text which is looked up via i18n.
   */
  footerTx?: TextProps["tx"]
  /**
   * Optional footer options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  footerTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Card.md)
 */
export function Card(props: CardProps) {
  const {
    content,
    contentTx,
    contentTxOptions,
    footer,
    footerTx,
    footerTxOptions,
    heading,
    headingTx,
    headingTxOptions,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = "top",
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    ...WrapperProps
  } = props

  const preset: Presets = $containerPresets[props.preset] ? props.preset : "default"
  const isPressable = !!WrapperProps.onPress
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx)
  const isContentPresent = !!(ContentComponent || content || contentTx)
  const isFooterPresent = !!(FooterComponent || footer || footerTx)

  const Wrapper: ComponentType<TouchableOpacityProps> = isPressable ? TouchableOpacity : View
  const HeaderContentWrapper = verticalAlignment === "force-footer-bottom" ? View : Fragment

  const $containerStyle = [$containerPresets[preset], $containerStyleOverride]
  const $headingStyle = [
    $headingPresets[preset],
    (isFooterPresent || isContentPresent) && { marginBottom: spacing.micro },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyle = [
    $contentPresets[preset],
    isHeadingPresent && { marginTop: spacing.micro },
    isFooterPresent && { marginBottom: spacing.micro },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $footerStyle = [
    $footerPresets[preset],
    (isHeadingPresent || isContentPresent) && { marginTop: spacing.micro },
    $footerStyleOverride,
    FooterTextProps?.style,
  ]
  const $alignmentWrapperStyle = [
    $alignmentWrapper,
    { justifyContent: $alignmentWrapperFlexOptions[verticalAlignment] },
    LeftComponent && { marginStart: spacing.medium },
    RightComponent && { marginEnd: spacing.medium },
  ]

  return (
    <Wrapper
      style={$containerStyle}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
    >
      {LeftComponent}

      <View style={$alignmentWrapperStyle}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text
                weight="bold"
                text={heading}
                tx={headingTx}
                txOptions={headingTxOptions}
                {...HeadingTextProps}
                style={$headingStyle}
              />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text
                weight="normal"
                text={content}
                tx={contentTx}
                txOptions={contentTxOptions}
                {...ContentTextProps}
                style={$contentStyle}
              />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              weight="normal"
              size="xs"
              text={footer}
              tx={footerTx}
              txOptions={footerTxOptions}
              {...FooterTextProps}
              style={$footerStyle}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  )
}

export const LockCard = ({
  lockAlias,
  electricQuantity,
  featureValue,
  startDate,
  endDate,
  userType,
  keyRight,
  style,
  ...rest
}) => {
  const remoteUnlock = parseFeatureValueWithIndex(featureValue, 10) ? "Remote Unlock" : " "
  const currentTimezone = moment.tz.guess()
  let info: string
  let dayLeft = Infinity
  if (startDate === 0 && endDate === 0) {
    info = "Permanent"
  } else {
    info = `${moment(startDate).tz(currentTimezone).format("YYYY-MM-DD HH:mm")} - ${moment(endDate)
      .tz(currentTimezone)
      .format("YYYY-MM-DD HH:mm")}`
  }
  if (info !== "Permanent") {
    dayLeft = Math.floor((endDate - Date.now()) / 1000 / 3600 / 24)
  }
  if (userType === "110301") {
    info += "/Admin"
  } else if (userType === "110302") {
    if (keyRight === 1) {
      info += "/Authorized Admin"
    }
  }
  return (
    <Card
      HeadingComponent={
        <View style={$titleContainer}>
          <Text style={$lockAlias}>{lockAlias}</Text>
          <View style={$batteryContainer}>
            <Text>{electricQuantity}%</Text>
            <Text> </Text>
            {electricQuantity >= 90 && <Icon name="battery-full-sharp" size={20} />}
            {electricQuantity > 0 && electricQuantity < 90 && (
              <Icon name="battery-half-sharp" size={20} />
            )}
            {electricQuantity === 0 && <Icon name="battery-dead" size={20} />}
          </View>
        </View>
      }
      ContentComponent={
        <>
          <OriginalText style={$remoteUnlock}>{remoteUnlock}</OriginalText>
          <View style={$TimePeriodContainer}>
            {(info.slice(0, 9) !== "Permanent" && dayLeft < 16) ? (
              dayLeft >= 0 ? (
                <OriginalText style={$dayLeft}>{dayLeft} day(s)</OriginalText>
              ) : (
                <OriginalText style={$expired}>Expired</OriginalText>
              )
            ) : (
              <OriginalText style={$placeholder}> </OriginalText>
            )}
          </View>
        </>
      }
      footer={info} // footer="2023.02.16 17:31 - 2023.03.17 17:31/Authorized Admin"
      footerStyle={$footer}
      style={[$customContainer, info.slice(0, 9) !== "Permanent" && dayLeft < 0 && { backgroundColor: "lightgrey" }, style]}
      {...rest}
    />
  )
}

const $containerBase: ViewStyle = {
  borderRadius: spacing.medium,
  padding: spacing.extraSmall,
  borderWidth: 1,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 12.81,
  elevation: 16,
  minHeight: 96,
  flexDirection: "row",
}

const $alignmentWrapper: ViewStyle = {
  flex: 1,
  alignSelf: "stretch",
}

const $alignmentWrapperFlexOptions = {
  top: "flex-start",
  center: "center",
  "space-between": "space-between",
  "force-footer-bottom": "space-between",
} as const

const $containerPresets = {
  default: [
    $containerBase,
    {
      backgroundColor: colors.palette.neutral100,
      borderColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $containerBase,
    { backgroundColor: colors.palette.neutral800, borderColor: colors.palette.neutral500 },
  ] as StyleProp<ViewStyle>,
}

const $headingPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}

const $contentPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}

const $footerPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}

const $titleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $lockAlias: TextStyle = {
  fontFamily: "SpaceGrotesk-Bold",
  // fontFamily: "spaceGroteskBold",
  fontSize: 18,
}

const $batteryContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $remoteUnlock: TextStyle = {
  fontFamily: "System",
  color: colors.palette.neutral400,
  fontSize: 10,
  marginTop: 2,
}

const $TimePeriodContainer: ViewStyle = {
  flexDirection: "row",
  marginTop: 5
}

const $dayLeft: TextStyle = {
  fontFamily: "System",
  backgroundColor: "orange",
  color: colors.palette.neutral100,
  fontSize: 10,
  paddingHorizontal: 2,
}

const $placeholder: TextStyle = {
  fontFamily: "System",
  color: "white",
  fontSize: 10
}

const $expired: TextStyle = {
  fontFamily: "System",
  backgroundColor: "red",
  color: colors.palette.neutral100,
  fontSize: 10,
  paddingHorizontal: 2,
}

const $footer: TextStyle = {
  fontSize: 11,
  fontFamily: "System",
  color: colors.palette.neutral600,
}

const $customContainer: ViewStyle = {
  shadowOpacity: 0.1,
  padding: 15,
}
