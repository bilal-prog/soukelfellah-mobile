import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import type { Theme } from "@/theme/types"

export const $styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: "space-between",
  } as ViewStyle,

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  } as ViewStyle,

  logoText: {
    fontSize: 26,
    lineHeight: 40,
    color: theme.colors.palette.primary,
  } as TextStyle,

  heroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  } as ViewStyle,

  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  heroImage: {
    width: "100%",
    height: 240,
    borderRadius: 16,
  } as ImageStyle,

  introSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  } as ViewStyle,

  title: {
    fontSize: 28,
    lineHeight: 44,
    color: theme.colors.palette.primary,
    marginBottom: 12,
    textAlign: "center",
  } as TextStyle,

  subtitle: {
    fontSize: 16,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 24,
  } as TextStyle,

  actionContainer: {
    gap: 16,
    width: "100%",
  } as ViewStyle,

  btnPrimary: {
    backgroundColor: theme.colors.palette.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  btnSecondary: {
    borderColor: theme.colors.palette.secondary,
    borderWidth: 2,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  btnTextPrimary: {
    color: "white",
    fontSize: 18,
  } as TextStyle,

  btnTextSecondary: {
    color: theme.colors.palette.secondary,
    fontSize: 18,
  } as TextStyle,

  guestButton: {
    marginTop: 16,
    alignItems: "center",
  } as ViewStyle,

  guestButtonText: {
    color: theme.colors.palette.primary,
    fontSize: 16,
    textDecorationLine: "underline",
  } as TextStyle,
})
