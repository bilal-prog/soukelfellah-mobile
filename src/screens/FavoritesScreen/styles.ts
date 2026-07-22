import { ViewStyle, TextStyle } from "react-native"

import { fontSizes } from "@/theme/fontSizes"
import type { Theme } from "@/theme/types"
import { s, vs } from "@/utils/scaling"

export const $styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(theme.spacing.marginMobile),
    height: vs(theme.spacing.touchTargetMin),
    backgroundColor: theme.colors.palette.surface,
  } as ViewStyle,

  headerSpacer: {
    width: s(26),
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs22,
    lineHeight: vs(34),
    color: theme.colors.palette.primary,
    flex: 1,
    textAlign: "center",
  } as TextStyle,

  flatListContent: {
    paddingHorizontal: s(theme.spacing.marginMobile),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  } as ViewStyle,

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(100),
    gap: s(16),
    paddingHorizontal: s(20),
  } as ViewStyle,

  emptyText: {
    textAlign: "center",
    color: theme.colors.palette.onSurfaceVariant,
    lineHeight: vs(24),
  } as TextStyle,
})
