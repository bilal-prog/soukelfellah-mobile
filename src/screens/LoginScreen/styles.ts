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

  headerSection: {
    marginBottom: vs(32),
    alignItems: "center",
  } as ViewStyle,

  logoCircle: {
    width: s(80),
    height: vs(80),
    borderRadius: s(40),
    backgroundColor: theme.colors.palette.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(16),
  } as ViewStyle,

  title: {
    fontSize: fontSizes.fs28,
    lineHeight: vs(44),
    color: theme.colors.palette.primary,
    marginBottom: vs(8),
  } as TextStyle,

  subtitle: {
    fontSize: fontSizes.fs16,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: vs(24),
  } as TextStyle,

  form: {
    marginBottom: vs(32),
    gap: s(20),
  } as ViewStyle,

  inputGroup: {
    marginBottom: 0,
  } as ViewStyle,

  forgotRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  } as ViewStyle,

  forgotPassword: {
    fontSize: fontSizes.fs14,
    color: theme.colors.palette.primary,
  } as TextStyle,

  loginBtn: {
    height: vs(56),
    borderRadius: s(28),
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(12),
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  loginBtnText: {
    color: "white",
    fontSize: fontSizes.fs18,
  } as TextStyle,

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  footerText: {
    fontSize: fontSizes.fs15,
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  signUpLink: {
    fontSize: fontSizes.fs15,
    color: theme.colors.palette.primary,
    fontWeight: "bold",
  } as TextStyle,

  signUpLinkWrapper: {
    marginHorizontal: s(4),
  } as ViewStyle,
})
