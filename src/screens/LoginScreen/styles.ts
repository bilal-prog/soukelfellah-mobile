import { ViewStyle, TextStyle, ImageStyle } from "react-native"

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
    width: vs(80),
    height: vs(80),
    borderRadius: s(100),
    backgroundColor: theme.colors.palette.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(16),
  } as ViewStyle,

  logo: {
    width: vs(70),
    height: vs(70),
    resizeMode: "contain",
    tintColor: theme.colors.palette.onPrimaryContainer,
  } as ImageStyle,

  title: {
    color: theme.colors.palette.primary,
    marginBottom: vs(8),
  } as TextStyle,

  subtitle: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
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
