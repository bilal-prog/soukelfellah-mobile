import { format } from "date-fns/format"
import type { Locale } from "date-fns/locale"
import { parseISO } from "date-fns/parseISO"
import i18n from "i18next"

type Options = Parameters<typeof format>[2]

let dateFnsLocale: Locale
export const loadDateFnsLocale = () => {
  const primaryTag = i18n.language ? i18n.language.split("-")[0] : "ar"
  switch (primaryTag) {
    case "en":
      dateFnsLocale = require("date-fns/locale/en-US").enUS
      break
    case "ar":
    case "ary":
      dateFnsLocale = require("date-fns/locale/ar").ar
      break
    case "fr":
      dateFnsLocale = require("date-fns/locale/fr").fr
      break
    default:
      dateFnsLocale = require("date-fns/locale/ar").ar
      break
  }
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  if (!dateFnsLocale) {
    loadDateFnsLocale()
  }
  const dateOptions = {
    ...options,
    locale: dateFnsLocale,
  }
  try {
    return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
  } catch {
    return date
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
