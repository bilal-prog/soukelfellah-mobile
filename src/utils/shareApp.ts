import { Share } from "react-native"
import { translate } from "@/localization/translate"

export const APP_SHARE_URL = "https://play.google.com/store/apps/details?id=com.soukelfellah"

/**
 * Open native share sheet to allow the user to share Souk Elfellah app link with others.
 */
export async function shareApp() {
  try {
    const title = translate("common:shareAppTitle")
    const message = `${translate("common:shareAppMessage")}\n${APP_SHARE_URL}`
    await Share.share({
      title,
      message,
      url: APP_SHARE_URL,
    })
  } catch (error) {
    console.warn("Error sharing app:", error)
  }
}
