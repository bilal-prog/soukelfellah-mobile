import { useEffect, useRef, useCallback } from "react"
import { Animated, Pressable, ViewStyle, TextStyle, Image, ImageStyle, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { s, vs } from "@/utils/scaling"

import { Text, TextProps } from "./Text"

export interface InAppBannerProps {
  /**
   * The title text to display if not using `titleTx`.
   */
  title?: TextProps["text"]
  /**
   * Title text which is looked up via i18n.
   */
  titleTx?: TextProps["tx"]
  /**
   * Optional title options to pass to i18n.
   */
  titleTxOptions?: TextProps["txOptions"]
  /**
   * The body text to display if not using `bodyTx`.
   */
  body?: TextProps["text"]
  /**
   * Body text which is looked up via i18n.
   */
  bodyTx?: TextProps["tx"]
  /**
   * Optional body options to pass to i18n.
   */
  bodyTxOptions?: TextProps["txOptions"]
  /**
   * An optional URL of an image to display on the left side of the banner.
   */
  imageUrl?: string

  onDismiss: () => void
  autoDismissMs?: number
}

export function InAppBanner(props: InAppBannerProps) {
  const {
    title,
    titleTx,
    titleTxOptions,
    body,
    bodyTx,
    bodyTxOptions,
    imageUrl,
    onDismiss,
    autoDismissMs = 4000,
  } = props
  const insets = useSafeAreaInsets()
  const translateY = useRef(new Animated.Value(-120)).current
  const { themed } = useAppTheme()

  const slideOut = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(onDismiss)
  }, [onDismiss, translateY])

  useEffect(() => {
    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start()

    // Auto dismiss
    const timer = setTimeout(() => slideOut(), imageUrl ? 6000 : autoDismissMs)
    return () => clearTimeout(timer)
  }, [autoDismissMs, imageUrl, slideOut, translateY])

  const isTitlePresent = !!(title || titleTx)
  const isBodyPresent = !!(body || bodyTx)

  return (
    <Animated.View
      style={[
        themed($container),
        {
          top: insets.top + 8,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable style={themed($inner)} onPress={slideOut}>
        {!!imageUrl && <Image source={{ uri: imageUrl }} style={themed($image)} />}
        <View style={themed($textContainer)}>
          {isTitlePresent && (
            <Text
              weight="semiBold"
              text={title}
              tx={titleTx}
              txOptions={titleTxOptions}
              style={themed($title)}
              numberOfLines={1}
            />
          )}
          {isBodyPresent && (
            <Text
              text={body}
              tx={bodyTx}
              txOptions={bodyTxOptions}
              style={themed($body)}
              numberOfLines={2}
            />
          )}
        </View>
      </Pressable>
    </Animated.View>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  left: s(theme.spacing.md),
  right: s(theme.spacing.md),
  zIndex: 9999,
  borderRadius: s(theme.spacing.sm),
  backgroundColor: theme.colors.palette.inverseSurface,
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
})

const $inner: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  padding: s(14),
  gap: s(theme.spacing.sm),
})

const $image: ThemedStyle<ImageStyle> = (theme) => ({
  width: s(44),
  height: vs(44),
  borderRadius: s(theme.spacing.xs),
  backgroundColor: theme.colors.palette.outlineVariant,
})

const $textContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  gap: vs(theme.spacing.xxxs),
})

const $title: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.inverseOnSurface,
  fontSize: fontSizes.fs14,
})

const $body: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.inverseOnSurface,
  opacity: 0.8,
  fontSize: fontSizes.fs13,
})
