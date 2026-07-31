import { format } from "date-fns/format"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import type { Locale } from "date-fns/locale"
import { parseISO } from "date-fns/parseISO"
import i18n from "i18next"

type Options = Parameters<typeof format>[2]

export const getDateFnsLocale = (): Locale => {
  const primaryTag = i18n.language ? i18n.language.split("-")[0] : "ar"
  switch (primaryTag) {
    case "en":
      return require("date-fns/locale/en-US").enUS
    case "fr":
      return require("date-fns/locale/fr").fr
    case "ar":
    case "ary":
    default:
      return require("date-fns/locale/ar").ar
  }
}

export const loadDateFnsLocale = () => {
  getDateFnsLocale()
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const localeToUse = getDateFnsLocale()
  const dateOptions = {
    ...options,
    locale: localeToUse,
  }
  try {
    return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
  } catch {
    return date
  }
}

export const formatRelativeTime = (dateInput?: string | Date) => {
  if (!dateInput) return ""
  try {
    const dateObj = typeof dateInput === "string" ? parseISO(dateInput) : dateInput
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: getDateFnsLocale(),
    })
  } catch {
    return String(dateInput)
  }
}

export const formatListingDate = (dateStr: string) => {
  if (!dateStr) return ""
  try {
    const { translate } = require("@/localization/translate")
    const date = parseISO(dateStr)
    const now = new Date()
    
    // Start of today (00:00:00)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // Start of yesterday (00:00:00)
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    
    if (date.getTime() >= todayStart.getTime()) {
      return translate("common:today")
    } else if (date.getTime() >= yesterdayStart.getTime()) {
      return translate("common:yesterday")
    } else {
      return formatDate(dateStr)
    }
  } catch {
    return dateStr
  }
}

