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
    justifyContent: "space-between",
    paddingHorizontal: s(theme.spacing.marginMobile),
    height: vs(theme.spacing.touchTargetMin),
    backgroundColor: theme.colors.palette.surface,
  } as ViewStyle,

  headerButton: {
    padding: s(4),
    position: "relative",
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs20,
    lineHeight: vs(34),
    color: theme.colors.palette.primary,
  } as TextStyle,

  notificationBadge: {
    position: "absolute",
    top: vs(4),
    right: s(4),
    width: s(8),
    height: vs(8),
    borderRadius: s(4),
    backgroundColor: theme.colors.palette.error,
  } as ViewStyle,

  flatListContent: {
    paddingHorizontal: s(theme.spacing.marginMobile),
    paddingTop: vs(16),
    paddingBottom: vs(100), // Leave space for FAB
  } as ViewStyle,

  searchBarContainer: {
    marginBottom: vs(20),
  } as ViewStyle,

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.palette.surfaceContainerLow,
    borderRadius: s(12),
    paddingHorizontal: s(16),
    height: vs(56),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  searchTextPlaceholder: {
    color: theme.colors.palette.onSurfaceVariant,
    fontSize: fontSizes.fs16,
    flex: 1,
    textAlign: "left",
    marginHorizontal: s(12),
  } as TextStyle,

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
  } as ViewStyle,

  sectionTitle: {
    color: theme.colors.palette.onSurface,
    textAlign: "left",
  } as TextStyle,

  viewAllText: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  categoriesContainer: {
    marginBottom: vs(28),
  } as ViewStyle,

  categoriesScroll: {
    flexDirection: "row",
    paddingVertical: vs(12),
  } as ViewStyle,

  fab: {
    position: "absolute",
    bottom: vs(24),
    right: s(20),
    width: s(56),
    height: vs(56),
    borderRadius: s(28),
    backgroundColor: theme.colors.palette.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 99,
  } as ViewStyle,
})
