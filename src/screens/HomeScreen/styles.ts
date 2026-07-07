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
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.marginMobile,
    height: theme.spacing.touchTargetMin,
    backgroundColor: theme.colors.palette.surface,
  } as ViewStyle,

  headerButton: {
    padding: 4,
    position: "relative",
  } as ViewStyle,

  headerTitle: {
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.palette.primary,
  } as TextStyle,

  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.palette.error,
  } as ViewStyle,

  flatListContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 100, // Leave space for FAB
  } as ViewStyle,

  searchBarContainer: {
    marginBottom: 20,
  } as ViewStyle,

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.palette.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  searchTextPlaceholder: {
    color: theme.colors.palette.onSurfaceVariant,
    fontSize: 16,
    flex: 1,
    textAlign: "left",
    marginHorizontal: 12,
  } as TextStyle,

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  } as ViewStyle,

  sectionTitle: {
    color: theme.colors.palette.onSurface,
    textAlign: "left",
  } as TextStyle,

  viewAllText: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  categoriesContainer: {
    marginBottom: 28,
  } as ViewStyle,

  categoriesScroll: {
    flexDirection: "row",
    paddingVertical: 12,
  } as ViewStyle,

  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
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
