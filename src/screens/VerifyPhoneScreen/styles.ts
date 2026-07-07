import { ViewStyle, TextStyle } from "react-native"

import type { Theme } from "@/theme/types"

export const $styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  } as ViewStyle,

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
  } as ViewStyle,

  content: {
    justifyContent: "center",
    paddingBottom: 40,
  } as ViewStyle,

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  } as ViewStyle,

  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  title: {
    fontSize: 26,
    lineHeight: 40,
    color: theme.colors.palette.onSurface,
    textAlign: "center",
    marginBottom: 12,
  } as TextStyle,

  subtitle: {
    fontSize: 16,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  } as TextStyle,

  phoneHighlight: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
  } as ViewStyle,

  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: theme.colors.palette.surfaceContainerLowest,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  otpInputFocused: {
    borderColor: theme.colors.palette.primary,
  } as TextStyle,

  confirmBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  } as ViewStyle,

  confirmBtnText: {
    color: "white",
    fontSize: 18,
  } as TextStyle,

  resendBtn: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  resendText: {
    color: theme.colors.palette.secondary,
    fontWeight: "bold",
  } as TextStyle,
})
