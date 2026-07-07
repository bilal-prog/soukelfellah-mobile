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

  headerSection: {
    marginBottom: 32,
    alignItems: "center",
  } as ViewStyle,

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.palette.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  } as ViewStyle,

  title: {
    fontSize: 28,
    lineHeight: 44,
    color: theme.colors.palette.primary,
    marginBottom: 8,
  } as TextStyle,

  subtitle: {
    fontSize: 16,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
  } as TextStyle,

  form: {
    marginBottom: 32,
    gap: 20,
  } as ViewStyle,

  inputGroup: {
    marginBottom: 0,
  } as ViewStyle,

  forgotRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: -8,
  } as ViewStyle,

  forgotPassword: {
    fontSize: 14,
    color: theme.colors.palette.primary,
  } as TextStyle,

  loginBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  loginBtnText: {
    color: "white",
    fontSize: 18,
  } as TextStyle,

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  footerText: {
    fontSize: 15,
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  signUpLink: {
    fontSize: 15,
    color: theme.colors.palette.primary,
    fontWeight: "bold",
  } as TextStyle,

  signUpLinkWrapper: {
    marginHorizontal: 4,
  } as ViewStyle,
})
