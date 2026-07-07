import i18n from "i18next"
import type { TOptions } from "i18next"

import { TxKeyPath } from "./index"

/**
 * Translates text.
 * @param {TxKeyPath} key - The i18n key.
 * @param {TOptions} options - The i18n options.
 * @returns {string} - The translated text.
 */
export function translate(key: TxKeyPath, options?: TOptions): string {
  if (i18n.isInitialized) {
    return i18n.t(key, options)
  }
  return key
}
