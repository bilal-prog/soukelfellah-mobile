import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import { fontSizes } from "@/theme/fontSizes"
import type { Theme } from "@/theme/types"
import { isRTL } from "@/localization"
import { s, vs } from "@/utils/scaling"

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
    paddingHorizontal: s(theme.spacing.marginMobile),
    height: vs(theme.spacing.touchTargetMin),
    backgroundColor: theme.colors.palette.surface,
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs18,
    color: theme.colors.text,
  } as TextStyle,

  headerRight: {
    flexDirection: "row",
    gap: s(12),
  } as ViewStyle,

  headerRightSpacer: {
    width: s(26),
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
    bottom: vs(12),
    alignSelf: "center",
    flexDirection: "row",
    gap: s(6),
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(20),
  } as ViewStyle,

  dot: {
    width: s(6),
    height: vs(6),
    borderRadius: s(3),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  } as ViewStyle,

  activeDot: {
    width: s(16),
    backgroundColor: "white",
  } as ViewStyle,

  scrollContent: {
    paddingBottom: vs(100), // Leave padding for fixed bottom actions
  } as ViewStyle,

  infoContainer: {
    padding: s(theme.spacing.marginMobile),
    gap: s(20),
  } as ViewStyle,

  priceTitleSection: {
    gap: s(8),
  } as ViewStyle,

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,

  priceText: {
    color: theme.colors.palette.primary,
    fontSize: fontSizes.fs28,
    lineHeight: vs(44),
  } as TextStyle,

  negotiationBadge: {
    backgroundColor: "rgba(15, 82, 56, 0.1)",
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: s(8),
  } as ViewStyle,

  titleText: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
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
    padding: s(16),
    borderRadius: s(12),
  } as ViewStyle,

  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(12),
  } as ViewStyle,

  sellerAvatar: {
    width: s(48),
    height: vs(48),
    borderRadius: s(24),
    backgroundColor: theme.colors.palette.secondaryContainer,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  sellerChevronBtn: {
    padding: s(4),
  } as ViewStyle,

  descSection: {
    gap: s(8),
  } as ViewStyle,

  descTitle: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  descBox: {
    backgroundColor: "white",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    padding: s(16),
  } as ViewStyle,

  descText: {
    color: theme.colors.palette.onSurfaceVariant,
    lineHeight: vs(24),
  } as TextStyle,

  specsGrid: {
    flexDirection: "row",
    gap: s(12),
  } as ViewStyle,

  specBox: {
    flex: 1,
    backgroundColor: theme.colors.palette.surfaceContainer,
    padding: s(12),
    borderRadius: s(12),
    gap: s(4),
  } as ViewStyle,

  fixedBottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    padding: s(16),
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: s(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  } as ViewStyle,

  ctaBtn: {
    flex: 1,
    height: vs(50),
    borderRadius: s(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: s(8),
  } as ViewStyle,

  ctaTextCall: {
    color: "white",
    fontSize: fontSizes.fs16,
  } as TextStyle,

  ctaTextWa: {
    color: theme.colors.palette.secondary,
    fontSize: fontSizes.fs16,
  } as TextStyle,

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: s(theme.spacing.md),
  } as ViewStyle,

  modalContent: {
    width: "100%",
    backgroundColor: theme.colors.palette.surface,
    borderRadius: s(16),
    padding: s(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  } as ViewStyle,

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
  } as ViewStyle,

  modalTitle: {
    fontSize: fontSizes.fs18,
    color: theme.colors.text,
  } as TextStyle,

  reasonsContainer: {
    gap: s(8),
    marginBottom: vs(16),
  } as ViewStyle,

  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    borderRadius: s(8),
    gap: s(10),
  } as ViewStyle,

  reasonOptionSelected: {
    borderColor: theme.colors.palette.primary,
    backgroundColor: "rgba(15, 82, 56, 0.05)",
  } as ViewStyle,

  reasonText: {
    fontSize: fontSizes.fs14,
    color: theme.colors.text,
  } as TextStyle,

  reasonTextSelected: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  descriptionInput: {
    height: vs(80),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    borderRadius: s(8),
    padding: s(10),
    textAlignVertical: "top",
    marginBottom: vs(20),
    color: theme.colors.text,
    fontSize: fontSizes.fs14,
  } as TextStyle,

  modalActions: {
    flexDirection: "row",
    gap: s(12),
    justifyContent: "flex-end",
  } as ViewStyle,

  modalBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: s(8),
    justifyContent: "center",
    alignItems: "center",
    minWidth: s(80),
  } as ViewStyle,

  modalBtnCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.palette.outline,
  } as ViewStyle,

  modalBtnSubmit: {
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  modalBtnTextCancel: {
    color: theme.colors.text,
    fontSize: fontSizes.fs14,
  } as TextStyle,

  modalBtnTextSubmit: {
    color: "white",
    fontSize: fontSizes.fs14,
  } as TextStyle,

  negotiableColor: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  badgesRow: {
    flexDirection: "row",
    gap: s(8),
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: vs(4),
  } as ViewStyle,

  badgeBuy: {
    backgroundColor: theme.colors.palette.secondary,
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: s(6),
  } as ViewStyle,

  badgeRent: {
    backgroundColor: theme.colors.palette.tertiary,
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: s(6),
  } as ViewStyle,

  badgeSell: {
    backgroundColor: theme.colors.palette.primary,
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: s(6),
  } as ViewStyle,

  badgeText: {
    color: "white",
    fontWeight: "bold",
  } as TextStyle,

  ctaBtnWhatsapp: {
    borderWidth: 2,
    borderColor: theme.colors.palette.secondary,
    backgroundColor: "transparent",
  } as ViewStyle,

  modalSubtitle: {
    color: theme.colors.palette.onSurfaceVariant,
    fontSize: fontSizes.fs12,
    marginBottom: vs(12),
  } as TextStyle,

  imageViewerBackground: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  } as ViewStyle,

  imageViewerCloseBtn: {
    position: "absolute",
    top: vs(50),
    right: s(20),
    zIndex: 10,
    padding: s(10),
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: s(25),
  } as ViewStyle,
})
