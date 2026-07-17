import { ViewStyle, TextStyle } from "react-native"

import type { Theme } from "@/theme/types"
import { isRTL } from "@/localization"

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
    gap: 16,
  } as ViewStyle,

  headerTitle: {
    fontSize: 22,
    lineHeight: 34,
    color: theme.colors.palette.primary,
    flex: 1,
    textAlign: "left",
  } as TextStyle,

  headerButton: {
    padding: 4,
    position: "relative",
  } as ViewStyle,

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
    paddingBottom: 40,
  } as ViewStyle,

  searchContainer: {
    gap: 12,
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

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "left",
    height: "100%",
  } as TextStyle,

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    paddingHorizontal: 16,
    height: 56,
  } as ViewStyle,

  locationBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,

  categoriesContainer: {
    marginBottom: 20,
  } as ViewStyle,

  sectionTitle: {
    marginBottom: 12,
    textAlign: "left",
  } as TextStyle,

  categoryChipsScroll: {
    flexDirection: "row",
  } as ViewStyle,

  chipItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
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
    marginBottom: 20,
  } as ViewStyle,

  priceInputsRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    gap: 12,
  } as ViewStyle,

  priceInputWrapper: {
    flex: 1,
    gap: 4,
  } as ViewStyle,

  priceLabel: {
    textTransform: "uppercase",
    color: theme.colors.palette.onSurfaceVariant,
    paddingHorizontal: 4,
  } as TextStyle,

  priceInput: {
    height: 48,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.text,
  } as TextStyle,

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  } as ViewStyle,

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    padding: 16,
  } as ViewStyle,

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.palette.outlineVariant,
    paddingBottom: 12,
  } as ViewStyle,

  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,
})
