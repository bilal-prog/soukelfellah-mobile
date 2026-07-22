import { ViewStyle, TextStyle } from "react-native"

import { fontSizes } from "@/theme/fontSizes"
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
    paddingBottom: vs(40),
  } as ViewStyle,

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(24),
  } as ViewStyle,

  iconBackground: {
    width: s(100),
    height: vs(100),
    borderRadius: s(50),
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  title: {
    fontSize: fontSizes.fs26,
    lineHeight: vs(40),
    color: theme.colors.palette.onSurface,
    textAlign: "center",
    marginBottom: vs(12),
  } as TextStyle,

  subtitle: {
    fontSize: fontSizes.fs16,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: vs(24),
    marginBottom: vs(32),
  } as TextStyle,

  phoneHighlight: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: s(8),
    marginBottom: vs(40),
  } as ViewStyle,

  otpInput: {
    width: s(48),
    height: vs(48),
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: theme.colors.palette.outlineVariant,
    backgroundColor: theme.colors.palette.surfaceContainerLowest,
    textAlign: "center",
    fontSize: fontSizes.fs20,
    fontWeight: "bold",
    color: theme.colors.palette.onSurface,
  } as TextStyle,

  otpInputFocused: {
    borderColor: theme.colors.palette.primary,
  } as TextStyle,

  confirmBtn: {
    height: vs(56),
    borderRadius: s(28),
    backgroundColor: theme.colors.palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(20),
  } as ViewStyle,

  confirmBtnText: {
    color: "white",
    fontSize: fontSizes.fs18,
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
