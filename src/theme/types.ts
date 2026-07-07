import type { StyleProp } from "react-native"

import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { timing } from "./timing"
import { typography } from "./typography"

export type ImmutableThemeContextModeT = "light" | "dark"
export type ThemeContextModeT = ImmutableThemeContextModeT | undefined

export type Colors = typeof colorsLight | typeof colorsDark
export type Spacing = typeof spacingLight | typeof spacingDark

export type Timing = typeof timing
export type Typography = typeof typography

export interface Theme {
  colors: Colors
  spacing: Spacing
  typography: Typography
  timing: Timing
  isDark: boolean
}

export type ThemedStyle<T> = (theme: Theme) => T
export type ThemedStyleArray<T> = (
  | ThemedStyle<T>
  | StyleProp<T>
  | (StyleProp<T> | ThemedStyle<T>)[]
)[]

export type AllowedStylesT<T> = ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>
export type ThemedFnT = <T>(styleOrStyleFn: AllowedStylesT<T>) => T
