import { I18nManager } from "react-native"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import "intl-pluralrules"

import ar from "./ar"
import ary from "./ary"
import en, { Translations } from "./en"
import fr from "./fr"

const fallbackLocale = "ary" // Moroccan Darija as default

const resources = {
  ary,
  ar,
  en,
  fr,
}

const initialLanguage = "ary"

export let isRTL = false

// Check if language needs RTL (Arabic or Darija)
const needsRTL = (lang: string) => {
  const code = lang.split("-")[0].toLowerCase()
  return code === "ar" || code === "ary"
}

if (needsRTL(initialLanguage)) {
  I18nManager.allowRTL(true)
  I18nManager.forceRTL(true)
  isRTL = true
} else {
  I18nManager.allowRTL(false)
  I18nManager.forceRTL(false)
}

export const initI18n = async () => {
  i18n.use(initReactI18next)

  await i18n.init({
    resources,
    lng: initialLanguage,
    fallbackLng: fallbackLocale,
    compatibilityJSON: "v3",
    interpolation: {
      escapeValue: false,
    },
  })

  // Dynamic RTL toggle on language change
  i18n.on("languageChanged", (lng) => {
    const shouldBeRTL = needsRTL(lng)
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL)
      I18nManager.forceRTL(shouldBeRTL)
      // Note: Changing RTL direction often requires app reload in React Native.
    }
  })

  return i18n
}

export type TxKeyPath = RecursiveKeyOf<Translations>

// Type-safe translation keypaths
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, true>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`, false>
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
  IsFirstLevel extends boolean,
> = TValue extends any[]
  ? Text
  : TValue extends object
    ? IsFirstLevel extends true
      ? Text | `${Text}:${RecursiveKeyOfInner<TValue>}`
      : Text | `${Text}.${RecursiveKeyOfInner<TValue>}`
    : Text
export default i18n
