import React, { memo } from "react"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

export interface FavoritesEmptyStateProps {
  styles: any
}

export const FavoritesEmptyState = memo(function FavoritesEmptyState({
  styles,
}: FavoritesEmptyStateProps) {
  const { theme } = useAppTheme()
  const colors = theme.colors

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={80} color={colors.palette.onSurfaceVariant} />
      <Text
        tx="common:noFavorites"
        preset="subheading"
        style={{ color: colors.palette.onSurface }}
      />
      <Text
        tx="common:noFavoritesDesc"
        style={styles.emptyText}
        size="xs"
      />
    </View>
  )
})
