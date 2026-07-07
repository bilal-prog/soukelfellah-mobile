import { ViewStyle, TextStyle } from "react-native"

import type { Theme } from "@/theme/types"

export const $styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.marginMobile,
    height: theme.spacing.touchTargetMin,
    backgroundColor: theme.colors.palette.surface,
  } as ViewStyle,

  headerSpacer: {
    width: 26,
  } as ViewStyle,

  headerTitle: {
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.palette.primary,
    flex: 1,
    textAlign: "center",
  } as TextStyle,

  flatListContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 40,
  } as ViewStyle,

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    gap: 16,
    paddingHorizontal: 30,
  } as ViewStyle,

  emptyText: {
    textAlign: "center",
    color: theme.colors.palette.onSurfaceVariant,
    lineHeight: 24,
  } as TextStyle,
})
