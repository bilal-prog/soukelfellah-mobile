import { ViewStyle, TextStyle } from "react-native"

import { fontSizes } from "@/theme/fontSizes"
import type { Theme } from "@/theme/types"
import { isRTL } from "@/localization"
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
    gap: s(16),
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs22,
    lineHeight: vs(34),
    color: theme.colors.palette.primary,
    flex: 1,
    textAlign: "left",
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

  flatListContent: {
    paddingHorizontal: s(theme.spacing.marginMobile),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  } as ViewStyle,

  searchContainer: {
    gap: s(12),
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

  searchInput: {
    flex: 1,
    fontSize: fontSizes.fs16,
    color: theme.colors.text,
    textAlign: "left",
    height: "100%",
  } as TextStyle,

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    paddingHorizontal: s(16),
    height: vs(56),
  } as ViewStyle,

  locationBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
  } as ViewStyle,

  categoriesContainer: {
    marginBottom: vs(20),
  } as ViewStyle,

  sectionTitle: {
    marginBottom: vs(12),
    textAlign: "left",
  } as TextStyle,

  categoryChipsScroll: {
    flexDirection: "row",
  } as ViewStyle,

  chipItem: {
    paddingHorizontal: s(20),
    paddingVertical: vs(8),
    borderRadius: s(20),
    marginHorizontal: s(4),
  } as ViewStyle,

  chipActive: {
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  chipInactive: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  chipTextActive: {
    color: "white",
  } as TextStyle,

  chipTextInactive: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  priceRangeContainer: {
    marginBottom: vs(20),
  } as ViewStyle,

  priceInputsRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: s(12),
  } as ViewStyle,

  priceInputWrapper: {
    flex: 1,
    gap: s(4),
  } as ViewStyle,

  priceLabel: {
    textTransform: "uppercase",
    color: theme.colors.palette.onSurfaceVariant,
    paddingHorizontal: s(4),
  } as TextStyle,

  priceInput: {
    height: vs(48),
    backgroundColor: "white",
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    paddingHorizontal: s(12),
    textAlign: "center",
    fontSize: fontSizes.fs16,
    color: theme.colors.text,
  } as TextStyle,

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
    marginTop: vs(8),
  } as ViewStyle,

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
  } as ViewStyle,

  sortText: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  } as ViewStyle,

  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: s(16),
    borderTopRightRadius: s(16),
    maxHeight: "70%",
    padding: s(16),
  } as ViewStyle,

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.palette.outlineVariant,
    paddingBottom: vs(12),
  } as ViewStyle,

  modalItem: {
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,
})
