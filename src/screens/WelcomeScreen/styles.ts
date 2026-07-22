import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import type { Theme } from "@/theme/types"
import { ms, s, vs } from "@/utils/scaling"

export const $styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: s(20),
    paddingBottom: vs(30),
    justifyContent: "space-between",
  } as ViewStyle,

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: vs(40),
    gap: s(8),
  } as ViewStyle,

  logoText: {
    fontSize: theme.fontSizes.fs26,
    lineHeight: vs(45),
    color: theme.colors.palette.primary,
  } as TextStyle,

  heroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: vs(30),
  } as ViewStyle,

  heroCircle: {
    width: s(140),
    height: vs(140),
    borderRadius: ms(70),
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  heroImage: {
    width: "100%",
    height: vs(240),
    borderRadius: ms(16),
  } as ImageStyle,

  introSection: {
    alignItems: "center",
    marginBottom: vs(40),
    paddingHorizontal: s(10),
  } as ViewStyle,

  title: {
    fontSize: theme.fontSizes.fs25,
    lineHeight: vs(44),
    color: theme.colors.palette.primary,
    marginBottom: vs(12),
    textAlign: "center",
  } as TextStyle,

  subtitle: {
    fontSize: theme.fontSizes.fs18,
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
    lineHeight: vs(34),
  } as TextStyle,

  actionContainer: {
    gap: s(16),
    width: "100%",
  } as ViewStyle,

  btnPrimary: {
    backgroundColor: theme.colors.palette.primary,
    height: vs(56),
    borderRadius: ms(28),
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  btnSecondary: {
    borderColor: theme.colors.palette.secondary,
    borderWidth: ms(2),
    height: vs(56),
    borderRadius: ms(28),
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  btnTextPrimary: {
    color: "white",
    fontSize: theme.fontSizes.fs16,
    lineHeight: vs(24),
  } as TextStyle,

  btnTextSecondary: {
    color: theme.colors.palette.secondary,
    fontSize: theme.fontSizes.fs16,
    lineHeight: vs(24),
  } as TextStyle,

  guestButton: {
    marginTop: vs(16),
    alignItems: "center",
  } as ViewStyle,

  guestButtonText: {
    color: theme.colors.palette.primary,
    fontSize: theme.fontSizes.fs16,
    lineHeight: vs(24),
    textDecorationLine: "underline",
  } as TextStyle,
})
