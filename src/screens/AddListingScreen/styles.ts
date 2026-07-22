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

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs20,
    lineHeight: vs(30),
    color: theme.colors.palette.primary,
  } as TextStyle,

  stepIndicators: {
    flexDirection: "row",
    gap: s(6),
    alignItems: "center",
  } as ViewStyle,

  stepDot: {
    width: s(8),
    height: vs(8),
    borderRadius: s(4),
  } as ViewStyle,

  stepDotActive: {
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  stepDotInactive: {
    backgroundColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  scrollContent: {
    paddingHorizontal: s(theme.spacing.marginMobile),
    paddingTop: vs(20),
    paddingBottom: vs(40),
  } as ViewStyle,

  section: {
    marginBottom: vs(24),
    gap: s(12),
  } as ViewStyle,

  sectionTitle: {
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  categoryGrid: {
    flexDirection: "row",
    gap: s(16),
  } as ViewStyle,

  categoryBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: s(20),
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: s(12),
    borderColor: theme.colors.palette.outlineVariant,
  } as ViewStyle,

  categoryIconCircle: {
    width: s(60),
    height: vs(60),
    borderRadius: s(30),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(12),
  } as ViewStyle,

  categoryIconProduce: {
    backgroundColor: "rgba(15, 82, 56, 0.1)",
  } as ViewStyle,

  categoryIconEquipment: {
    backgroundColor: "rgba(128, 85, 44, 0.1)",
  } as ViewStyle,

  uploadSection: {
    gap: s(8),
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
    borderRadius: s(12),
    aspectRatio: 1.77, // 16:9 aspect
    justifyContent: "center",
    alignItems: "center",
    gap: s(8),
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: theme.colors.palette.surfaceContainerLow,
  } as ViewStyle,

  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(8),
    marginTop: vs(12),
  } as ViewStyle,

  previewWrapper: {
    width: s(72),
    height: vs(72),
    borderRadius: s(8),
    overflow: "hidden",
    position: "relative",
  } as ViewStyle,

  previewImage: {
    width: "100%",
    height: "100%",
  } as ImageStyle,

  deletePreviewBtn: {
    position: "absolute",
    top: vs(2),
    right: s(2),
    backgroundColor: theme.colors.palette.error,
    borderRadius: s(10),
    width: s(20),
    height: vs(20),
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  formGroup: {
    gap: s(16),
  } as ViewStyle,

  inputField: {
    marginBottom: 0,
  } as ViewStyle,

  quantityPriceRow: {
    flexDirection: "row",
    gap: s(12),
  } as ViewStyle,

  inputWrapperHalf: {
    flex: 1,
  } as ViewStyle,

  submitBtn: {
    height: vs(56),
    borderRadius: s(28),
    backgroundColor: theme.colors.palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(20),
  } as ViewStyle,

  submitBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
  } as ViewStyle,

  submitBtnText: {
    color: "white",
    fontSize: fontSizes.fs18,
  } as TextStyle,

  selectTrigger: {
    borderWidth: 1,
    borderRadius: s(4),
    borderColor: theme.colors.palette.outline,
    backgroundColor: theme.colors.palette.surface,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    minHeight: vs(56),
    justifyContent: "center",
  } as ViewStyle,

  selectLabel: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "left",
    marginBottom: vs(4),
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

  inputWrapperFull: {
    width: "100%",
  } as ViewStyle,

  segmentRow: {
    flexDirection: "row",
    gap: s(8),
    marginTop: vs(4),
    marginBottom: vs(8),
  } as ViewStyle,

  segmentButton: {
    flex: 1,
    height: vs(48),
    borderRadius: s(8),
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
    fontSize: fontSizes.fs13,
    fontWeight: "500",
  } as TextStyle,

  segmentTextActive: {
    color: "white",
    fontWeight: "bold",
  } as TextStyle,
})
