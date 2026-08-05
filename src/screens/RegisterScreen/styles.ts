import { ViewStyle, TextStyle } from "react-native"

import type { Theme } from "@/theme/types"
import { s, vs } from "@/utils/scaling"

export const $styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: s(24),
    paddingBottom: vs(24),
  } as ViewStyle,

  backButton: {
    width: s(44),
    height: vs(44),
    borderRadius: s(22),
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: vs(10),
  } as ViewStyle,

  content: {
    justifyContent: "center",
    paddingBottom: vs(20),
  } as ViewStyle,

  headerSection: {
    marginBottom: vs(24),
    alignItems: "center",
  } as ViewStyle,

  title: {
    color: theme.colors.palette.primary,
    marginBottom: vs(8),
  } as TextStyle,

  subtitle: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
  } as TextStyle,

  form: {
    marginBottom: vs(24),
    gap: s(16),
  } as ViewStyle,

  inputGroup: {
    marginBottom: 0,
  } as ViewStyle,

  registerBtn: {
    height: vs(56),
    borderRadius: s(28),
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(10),
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  registerBtnText: {
    color: "white",
  } as TextStyle,

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(10),
  } as ViewStyle,

  footerText: {
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  loginLink: {
    color: theme.colors.palette.primary,
    fontWeight: "bold",
  } as TextStyle,

  loginLinkWrapper: {
    marginHorizontal: s(4),
  } as ViewStyle,

  legalDisclaimerContainer: {
    marginTop: vs(6),
    marginBottom: vs(4),
    paddingHorizontal: s(4),
  } as ViewStyle,

  legalDisclaimerText: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
  } as TextStyle,

  legalLink: {
    color: theme.colors.palette.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
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
    width: "90%",
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
    minHeight: vs(250),
    padding: s(16),
    flexShrink: 1,
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
