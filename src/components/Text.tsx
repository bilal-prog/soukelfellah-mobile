import { ReactNode, forwardRef, ForwardedRef } from "react"
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native"
import { TOptions } from "i18next"

import { isRTL, TxKeyPath } from "@/localization"
import { translate } from "@/localization/translate"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { typography } from "@/theme/typography"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets =
  | "default"
  | "bold"
  | "heading"
  | "subheading"
  | "formLabel"
  | "formHelper"
  | "display"

export interface TextProps extends RNTextProps {
  tx?: TxKeyPath
  text?: string
  txOptions?: TOptions
  style?: StyleProp<TextStyle>
  preset?: Presets
  weight?: Weights
  size?: Sizes
  children?: ReactNode
}

export const Text = forwardRef(function Text(props: TextProps, ref: ForwardedRef<RNText>) {
  const { weight, size, tx, txOptions, text, children, style: $styleOverride, ...rest } = props
  const { themed } = useAppTheme()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = props.preset ?? "default"
  const $styles: StyleProp<TextStyle> = [
    $rtlStyle,
    themed($presets[preset]),
    weight && $fontWeightStyles[weight],
    size && $sizeStyles[size],
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles} ref={ref}>
      {content}
    </RNText>
  )
})

const $sizeStyles = {
  xxl: { fontSize: 30, lineHeight: 45 } satisfies TextStyle, // display-lg
  xl: { fontSize: 24, lineHeight: 37 } satisfies TextStyle, // headline-md
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle, // headline-sm
  md: { fontSize: 18, lineHeight: 30 } satisfies TextStyle, // body-lg
  sm: { fontSize: 16, lineHeight: 29 } satisfies TextStyle, // body-md
  xs: { fontSize: 14, lineHeight: 25 } satisfies TextStyle, // label-lg
  xxs: { fontSize: 12, lineHeight: 19 } satisfies TextStyle, // label-md
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: ThemedStyle<TextStyle> = (theme) => ({
  ...$sizeStyles.sm,
  ...$fontWeightStyles.normal,
  color: theme.colors.text,
  // textAlign: isRTL ? "right" : "left",
})

const $presets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [$baseStyle],
  bold: [$baseStyle, { ...$fontWeightStyles.bold }],
  display: [
    $baseStyle,
    {
      ...$sizeStyles.xxl,
      ...$fontWeightStyles.bold,
    },
  ],
  heading: [
    $baseStyle,
    {
      ...$sizeStyles.xl,
      ...$fontWeightStyles.bold,
    },
  ],
  subheading: [$baseStyle, { ...$sizeStyles.lg, ...$fontWeightStyles.semiBold }],
  formLabel: [$baseStyle, { ...$sizeStyles.xs, ...$fontWeightStyles.bold }],
  formHelper: [$baseStyle, { ...$sizeStyles.xxs, ...$fontWeightStyles.normal, color: "#707973" }],
}
const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
