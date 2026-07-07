import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import type { Theme } from "@/theme/types"

export const $styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    color: theme.colors.text,
  } as TextStyle,

  headerRight: {
    flexDirection: "row",
    gap: 12,
  } as ViewStyle,

  headerRightSpacer: {
    width: 26,
  } as ViewStyle,

  galleryContainer: {
    width: "100%",
    aspectRatio: 1.33,
    backgroundColor: theme.colors.palette.surfaceContainerHighest,
    position: "relative",
  } as ViewStyle,

  galleryImage: {
    width: "100%",
    height: "100%",
  } as ImageStyle,

  indicators: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: [{ translateX: -20 }],
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  } as ViewStyle,

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  } as ViewStyle,

  activeDot: {
    width: 16,
    backgroundColor: "white",
  } as ViewStyle,

  scrollContent: {
    paddingBottom: 100, // Leave padding for fixed bottom actions
  } as ViewStyle,

  infoContainer: {
    padding: theme.spacing.marginMobile,
    gap: 20,
  } as ViewStyle,

  priceTitleSection: {
    gap: 8,
  } as ViewStyle,

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,

  priceText: {
    color: theme.colors.palette.primary,
    fontSize: 28,
    lineHeight: 44,
  } as TextStyle,

  negotiationBadge: {
    backgroundColor: "rgba(15, 82, 56, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  } as ViewStyle,

  titleText: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  } as ViewStyle,

  locationText: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.palette.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    padding: 16,
    borderRadius: 12,
  } as ViewStyle,

  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  } as ViewStyle,

  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.palette.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  sellerChevronBtn: {
    padding: 4,
  } as ViewStyle,

  descSection: {
    gap: 8,
  } as ViewStyle,

  descTitle: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  descBox: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    padding: 16,
  } as ViewStyle,

  descText: {
    color: theme.colors.palette.onSurfaceVariant,
    lineHeight: 24,
  } as TextStyle,

  specsGrid: {
    flexDirection: "row",
    gap: 12,
  } as ViewStyle,

  specBox: {
    flex: 1,
    backgroundColor: theme.colors.palette.surfaceContainer,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  } as ViewStyle,

  fixedBottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  } as ViewStyle,

  ctaBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,

  ctaTextCall: {
    color: "white",
    fontSize: 16,
  } as TextStyle,

  ctaTextWa: {
    color: theme.colors.palette.secondary,
    fontSize: 16,
  } as TextStyle,
})
