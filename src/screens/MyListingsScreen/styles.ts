import { ViewStyle, TextStyle, ImageStyle } from "react-native"

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

  headerTitle: {
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.palette.primary,
  } as TextStyle,

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: theme.spacing.marginMobile,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    gap: 16,
  } as ViewStyle,

  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  profileDetails: {
    flex: 1,
    gap: 4,
  } as ViewStyle,

  profilePhone: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  statsSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  } as ViewStyle,

  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  } as ViewStyle,

  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    alignItems: "center",
    gap: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  } as ViewStyle,

  statLabel: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  statValueTotal: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  statValueViews: {
    color: theme.colors.palette.secondary,
  } as TextStyle,

  statValueMessages: {
    color: theme.colors.palette.tertiary,
  } as TextStyle,

  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    marginBottom: 16,
  } as ViewStyle,

  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    position: "relative",
  } as ViewStyle,

  tabTextActive: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  tabTextInactive: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  activeTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.palette.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  } as ViewStyle,

  flatListContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 40,
  } as ViewStyle,

  emptyStateContainer: {
    alignItems: "center",
    marginTop: 40,
  } as ViewStyle,

  emptyStateText: {
    color: theme.colors.palette.onSurfaceVariant,
    marginTop: 12,
  } as TextStyle,

  listingCardWrapper: {
    marginBottom: 16,
  } as ViewStyle,

  listingRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    overflow: "hidden",
    height: 110,
  } as ViewStyle,

  listingImage: {
    width: 100,
    height: "100%",
  } as ImageStyle,

  listingInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  } as ViewStyle,

  listingPriceText: {
    color: theme.colors.palette.primary,
    marginTop: 4,
  } as TextStyle,

  listingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  } as ViewStyle,

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  } as ViewStyle,

  metaText: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  listingActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: -16,
    marginBottom: 20,
  } as ViewStyle,

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderRightWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  actionTextEdit: {
    color: theme.colors.palette.secondary,
    fontWeight: "bold",
  } as TextStyle,

  actionTextSold: {
    color: theme.colors.palette.primary,
    fontWeight: "bold",
  } as TextStyle,

  deleteBtn: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
})
