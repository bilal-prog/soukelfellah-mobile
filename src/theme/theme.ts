import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { spacing as spacingLight } from "./spacing"
import { spacing as spacingDark } from "./spacingDark"
import { fontSizes } from "./fontSizes"
import { timing } from "./timing"
import type { Theme } from "./types"
import { typography } from "./typography"

export const lightTheme: Theme = {
  colors: colorsLight,
  spacing: spacingLight,
  fontSizes,
  typography,
  timing,
  isDark: false,
}

export const darkTheme: Theme = {
  colors: colorsDark,
  spacing: spacingDark,
  fontSizes,
  typography,
  timing,
  isDark: true,
}
