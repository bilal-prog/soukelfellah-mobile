import type { Theme } from "./types"

const systemui = require("expo-system-ui")

export const setSystemUIBackgroundColor = (color: string) => {
  if (systemui && systemui.setBackgroundColorAsync) {
    systemui.setBackgroundColorAsync(color)
  }
}

export const setImperativeTheming = (theme: Theme) => {
  setSystemUIBackgroundColor(theme.colors.background)
}
