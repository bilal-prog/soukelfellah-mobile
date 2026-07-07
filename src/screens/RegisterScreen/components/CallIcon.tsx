import React, { memo } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "@/theme/context"

export const CallIcon = memo(function CallIcon(iconProps: { style: any }) {
  const { theme } = useAppTheme()
  return (
    <View style={iconProps.style}>
      <Ionicons name="call-outline" size={20} color={theme.colors.palette.onSurfaceVariant} />
    </View>
  )
})
