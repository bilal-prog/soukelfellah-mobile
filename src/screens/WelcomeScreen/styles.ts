import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import type { Theme } from "@/theme/types"
import { ms, s, vs } from "@/utils/scaling"

export const $styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
  } as ViewStyle,

  bg: {
    flex: 1,
  } as ViewStyle,

  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingBottom: vs(30),
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  } as ViewStyle,

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: vs(40),
    gap: s(8),
  } as ViewStyle,

  logo: {
    width: s(50),
    height: vs(50),
    resizeMode: "contain",
    tintColor: theme.colors.palette.primary,
  } as ImageStyle,

  logoText: {
    color: theme.colors.palette.primary,
  } as TextStyle,

  heroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: vs(30),
  } as ViewStyle,

  heroCircle: {
    width: vs(140),
    height: vs(140),
    borderRadius: ms(100),
    backgroundColor: theme.colors.palette.primaryFixed,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  heroLogo: {
    width: vs(120),
    height: vs(120),
    resizeMode: "contain",
    tintColor: theme.colors.palette.primary,
  } as ImageStyle,

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
    color: theme.colors.palette.primary,
    marginBottom: vs(12),
    textAlign: "center",
  } as TextStyle,

  subtitle: {
    color: theme.colors.palette.onSurfaceVariant,
    textAlign: "center",
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
    fontSize: vs(22),
    lineHeight: vs(32),
    width: "100%",
    textAlign: "center",
  } as TextStyle,

  btnTextSecondary: {
    color: theme.colors.palette.secondary,
    fontSize: vs(22),
    lineHeight: vs(32),
    width: "100%",
    textAlign: "center",
  } as TextStyle,

  guestButton: {
    marginTop: vs(16),
    alignItems: "center",
  } as ViewStyle,

  guestButtonText: {
    color: theme.colors.palette.primary,
    textDecorationLine: "underline",
    textAlign: "center",
    width: "55%",
  } as TextStyle,
})
