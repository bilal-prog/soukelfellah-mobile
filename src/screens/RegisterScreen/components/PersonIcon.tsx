import React, { memo } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "@/theme/context"
import { s } from "@/utils/scaling"

export const PersonIcon = memo(function PersonIcon(iconProps: { style: any }) {
  const { theme } = useAppTheme()
  return (
    <View style={iconProps.style}>
      <Ionicons name="person-outline" size={s(20)} color={theme.colors.palette.onSurfaceVariant} />
    </View>
  )
})
