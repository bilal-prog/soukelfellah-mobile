import { ViewStyle, TextStyle, ImageStyle } from "react-native"

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

  headerTitle: {
    fontSize: fontSizes.fs22,
    lineHeight: vs(34),
    color: theme.colors.palette.primary,
  } as TextStyle,

  headerButton: {
    padding: s(4),
    position: "relative",
  } as ViewStyle,

  notificationBadge: {
    position: "absolute",
    top: vs(4),
    right: s(4),
    width: s(8),
    height: vs(8),
    borderRadius: s(4),
    backgroundColor: theme.colors.palette.error,
  } as ViewStyle,

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(16),
    marginHorizontal: s(theme.spacing.marginMobile),
    marginTop: vs(16),
    backgroundColor: "white",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    gap: s(16),
  } as ViewStyle,

  profileAvatar: {
    width: s(60),
    height: vs(60),
    borderRadius: s(30),
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  profileDetails: {
    flex: 1,
    gap: s(4),
  } as ViewStyle,

  profilePhone: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  statsSection: {
    paddingHorizontal: s(16),
    marginTop: vs(16),
  } as ViewStyle,

  statsContainer: {
    flexDirection: "row",
    gap: s(12),
    marginBottom: vs(24),
  } as ViewStyle,

  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: s(12),
    padding: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    alignItems: "center",
    gap: s(4),
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
    marginBottom: vs(16),
  } as ViewStyle,

  tabButton: {
    flex: 1,
    paddingVertical: vs(14),
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
    height: vs(3),
    backgroundColor: theme.colors.palette.primary,
    borderTopLeftRadius: s(3),
    borderTopRightRadius: s(3),
  } as ViewStyle,

  flatListContent: {
    paddingHorizontal: s(theme.spacing.marginMobile),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  } as ViewStyle,

  emptyStateContainer: {
    alignItems: "center",
    marginTop: vs(40),
  } as ViewStyle,

  emptyStateText: {
    color: theme.colors.palette.onSurfaceVariant,
    marginTop: vs(12),
  } as TextStyle,

  listingCardWrapper: {
    marginBottom: vs(16),
  } as ViewStyle,

  listingRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    overflow: "hidden",
    height: vs(110),
  } as ViewStyle,

  listingImage: {
    width: s(100),
    height: "100%",
  } as ImageStyle,

  listingInfo: {
    flex: 1,
    padding: s(12),
    justifyContent: "space-between",
  } as ViewStyle,

  listingPriceText: {
    color: theme.colors.palette.primary,
    marginTop: vs(4),
  } as TextStyle,

  listingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(12),
    marginBottom: vs(10),
  } as ViewStyle,

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(2),
  } as ViewStyle,

  metaText: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  listingActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: "white",
    borderRadius: s(12),
    borderWidth: 1,
    marginTop: vs(-16),
    marginBottom: vs(20),
  } as ViewStyle,

  actionBtn: {
    flex: 1,
    paddingVertical: vs(12),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: s(6),
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
    width: s(50),
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
})
