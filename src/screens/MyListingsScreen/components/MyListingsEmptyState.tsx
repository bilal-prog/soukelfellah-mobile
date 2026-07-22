import React, { memo } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { s } from "@/utils/scaling"

export interface MyListingsEmptyStateProps {
  styles: any
}

export const MyListingsEmptyState = memo(function MyListingsEmptyState({
  styles,
}: MyListingsEmptyStateProps) {
  const { theme } = useAppTheme()
  const colors = theme.colors

  return (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="clipboard-outline" size={s(48)} color={colors.palette.onSurfaceVariant} />
      <Text tx="myListings:noListings" size="xs" style={styles.emptyStateText} />
    </View>
  )
})
