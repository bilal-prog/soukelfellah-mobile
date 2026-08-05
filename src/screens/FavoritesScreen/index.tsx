import React, { FC, memo, useCallback } from "react"
import { View, TouchableOpacity, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"

import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { ListingFeedSkeleton } from "@/components/Skeletons"
import { useAuth } from "@/context/AuthContext"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { getUserFavorites } from "@/services/api/modules"
import { useAppTheme } from "@/theme/context"

import { FavoritesEmptyState } from "./components/FavoritesEmptyState"
import { FavoritesListingItem } from "./components/FavoritesListingItem"
import { $styles } from "./styles"
import { isRTL } from "@/localization"
import { s } from "@/utils/scaling"

interface FavoritesScreenProps extends MainTabScreenProps<"Favorites"> {}

export const FavoritesScreen: FC<FavoritesScreenProps> = memo(function FavoritesScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props
  const { isAuthenticated } = useAuth()

  // Fetch populated favorited listings in a single request
  const { data: favoritedListings = [], isLoading } = useQuery({
    queryKey: ["userFavorites"],
    queryFn: async () => {
      const res = await getUserFavorites()
      if (res.kind === "failure") throw new Error("Could not fetch user favorites")
      return res.listings
    },
    enabled: isAuthenticated,
  })

  const handleListingDetails = useCallback(
    (id: string) => {
      navigation.navigate("ListingDetails", { listingId: id })
    },
    [navigation],
  )

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const renderFavoriteItem = useCallback(
    ({ item }: { item: any }) => {
      return <FavoritesListingItem item={item} onPress={() => handleListingDetails(item?._id)} />
    },
    [handleListingDetails],
  )

  const renderFavoritesEmptyState = useCallback(() => {
    return <FavoritesEmptyState styles={styles} />
  }, [styles])

  if (!isAuthenticated) {
    return (
      <GuestPlaceholder
        icon="heart-outline"
        titleTx="guest:favoritesTitle"
        descriptionTx="guest:favoritesDesc"
      />
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={s(26)}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text tx="common:favorites" style={styles.headerTitle} size="lg" preset="bold" />
        <View style={styles.headerSpacer} />
      </View>

      {/* Main content using FlatList */}
      {isLoading ? (
        <ListingFeedSkeleton count={3} />
      ) : (
        <FlatList
          data={favoritedListings}
          keyExtractor={(item) => item?._id}
          renderItem={renderFavoriteItem}
          ListEmptyComponent={renderFavoritesEmptyState}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
})

export default FavoritesScreen
