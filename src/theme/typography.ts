import { Platform } from "react-native"
import {
  Cairo_300Light as cairoLight,
  Cairo_400Regular as cairoRegular,
  Cairo_500Medium as cairoMedium,
  Cairo_600SemiBold as cairoSemiBold,
  Cairo_700Bold as cairoBold,
} from "@expo-google-fonts/cairo"
import {
  NotoSansArabic_300Light as notoLight,
  NotoSansArabic_400Regular as notoRegular,
  NotoSansArabic_500Medium as notoMedium,
  NotoSansArabic_600SemiBold as notoSemiBold,
  NotoSansArabic_700Bold as notoBold,
} from "@expo-google-fonts/noto-sans-arabic"

export const customFontsToLoad = {
  cairoLight,
  cairoRegular,
  cairoMedium,
  cairoSemiBold,
  cairoBold,
  notoLight,
  notoRegular,
  notoMedium,
  notoSemiBold,
  notoBold,
}

const fonts = {
  cairo: {
    light: "cairoLight",
    normal: "cairoRegular",
    medium: "cairoMedium",
    semiBold: "cairoSemiBold",
    bold: "cairoBold",
  },
  notoSansArabic: {
    light: "notoLight",
    normal: "notoRegular",
    medium: "notoMedium",
    semiBold: "notoSemiBold",
    bold: "notoBold",
  },
}

export const typography = {
  fonts,
  primary: fonts.notoSansArabic,
  secondary: fonts.cairo,
  code: Platform.select({ ios: "Courier", android: "monospace" }),
}
