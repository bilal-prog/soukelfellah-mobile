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

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,

  headerTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: theme.colors.palette.primary,
  } as TextStyle,

  stepIndicators: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  } as ViewStyle,

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  } as ViewStyle,

  stepDotActive: {
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  stepDotInactive: {
    backgroundColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  scrollContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: 20,
    paddingBottom: 40,
  } as ViewStyle,

  section: {
    marginBottom: 24,
    gap: 12,
  } as ViewStyle,

  sectionTitle: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  categoryGrid: {
    flexDirection: "row",
    gap: 16,
  } as ViewStyle,

  categoryBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  } as ViewStyle,

  categoryIconProduce: {
    backgroundColor: "rgba(15, 82, 56, 0.1)",
  } as ViewStyle,

  categoryIconEquipment: {
    backgroundColor: "rgba(128, 85, 44, 0.1)",
  } as ViewStyle,

  uploadSection: {
    gap: 8,
  } as ViewStyle,

  uploadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  } as ViewStyle,

  photoLimitText: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    aspectRatio: 1.77, // 16:9 aspect
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: theme.colors.palette.surfaceContainerLow,
  } as ViewStyle,

  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  } as ViewStyle,

  previewWrapper: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  } as ViewStyle,

  previewImage: {
    width: "100%",
    height: "100%",
  } as ImageStyle,

  deletePreviewBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: theme.colors.palette.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  formGroup: {
    gap: 16,
  } as ViewStyle,

  inputField: {
    marginBottom: 0,
  } as ViewStyle,

  quantityPriceRow: {
    flexDirection: "row",
    gap: 12,
  } as ViewStyle,

  inputWrapperHalf: {
    flex: 1,
  } as ViewStyle,

  submitBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  } as ViewStyle,

  submitBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  } as ViewStyle,

  submitBtnText: {
    color: "white",
    fontSize: 18,
  } as TextStyle,

  selectTrigger: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.palette.outline,
    backgroundColor: theme.colors.palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
    justifyContent: "center",
  } as ViewStyle,

  selectLabel: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "left",
    marginBottom: 4,
  } as TextStyle,

  selectContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,

  selectValueText: {
    color: theme.colors.text,
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

  inputWrapperFull: {
    width: "100%",
  } as ViewStyle,

  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  } as ViewStyle,

  segmentButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.palette.outlineVariant,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.palette.surfaceContainerLow,
  } as ViewStyle,

  segmentButtonActive: {
    backgroundColor: theme.colors.palette.primary,
    borderColor: theme.colors.palette.primary,
  } as ViewStyle,

  segmentText: {
    color: theme.colors.palette.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "500",
  } as TextStyle,

  segmentTextActive: {
    color: "white",
    fontWeight: "bold",
  } as TextStyle,
})
