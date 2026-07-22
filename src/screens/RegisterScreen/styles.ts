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
    paddingBottom: 20,
  } as ViewStyle,

  headerSection: {
    marginBottom: 24,
    alignItems: "center",
  } as ViewStyle,

  title: {
    fontSize: 26,
    lineHeight: 40,
    color: theme.colors.palette.primary,
    marginBottom: 8,
  } as TextStyle,

  subtitle: {
    fontSize: 15,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 22,
  } as TextStyle,

  form: {
    marginBottom: 24,
    gap: 16,
  } as ViewStyle,

  inputGroup: {
    marginBottom: 0,
  } as ViewStyle,

  registerBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: theme.colors.palette.primary,
  } as ViewStyle,

  registerBtnText: {
    color: "white",
    fontSize: 18,
  } as TextStyle,

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  } as ViewStyle,

  footerText: {
    fontSize: 15,
    color: theme.colors.palette.onSurfaceVariant,
  } as TextStyle,

  loginLink: {
    fontSize: 15,
    color: theme.colors.palette.primary,
    fontWeight: "bold",
  } as TextStyle,

  loginLinkWrapper: {
    marginHorizontal: 4,
  } as ViewStyle,

  legalDisclaimerContainer: {
    marginTop: 6,
    marginBottom: 4,
    paddingHorizontal: 4,
  } as ViewStyle,

  legalDisclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
  } as TextStyle,

  legalLink: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.palette.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  } as TextStyle,
})

