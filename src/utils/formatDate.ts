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
