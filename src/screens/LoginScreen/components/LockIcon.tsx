import React, { memo } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "@/theme/context"

export const LockIcon = memo(function LockIcon(iconProps: { style: any }) {
  const { theme } = useAppTheme()
  return (
    <View style={iconProps.style}>
      <Ionicons
        name="lock-closed-outline"
        size={20}
        color={theme.colors.palette.onSurfaceVariant}
      />
    </View>
  )
})
