import React, { FC, memo, useCallback, useMemo } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useQueries } from "@tanstack/react-query"

import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { getListingDetails } from "@/services/api/modules/listings"
import { useAppTheme } from "@/theme/context"

import { FavoritesEmptyState } from "./components/FavoritesEmptyState"
import { FavoritesListingItem } from "./components/FavoritesListingItem"
import { $styles } from "./styles"
import { isRTL } from "@/localization"

interface FavoritesScreenProps extends MainTabScreenProps<"Favorites"> {}

export const FavoritesScreen: FC<FavoritesScreenProps> = memo(function FavoritesScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props
  const { favorites, isAuthenticated } = useAuth()

  // Fetch details for each favorited listing ID in parallel
  const favoritesQueries = useQueries({
    queries: (favorites || []).map((id) => ({
      queryKey: ["listingDetails", id],
      queryFn: async () => {
        const res = await getListingDetails(id)
        if (res.kind === "failure") throw new Error("Could not fetch listing details")
        return res.listing
      },
    })),
  })

  // Map only the successfully resolved listing details
  const favoritedListings = useMemo(() => {
    return favoritesQueries.map((q) => q.data).filter((listing): listing is any => !!listing)
  }, [favoritesQueries])

  // Determine loading state across all parallel queries
  const isLoading = favoritesQueries.some((q) => q.isLoading)

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
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
        </TouchableOpacity>
        <Text tx="common:favorites" style={styles.headerTitle} preset="bold" />
        <View style={styles.headerSpacer} />
      </View>

      {/* Main content using FlatList */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
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
