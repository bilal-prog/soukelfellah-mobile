import React, { FC, memo, useCallback, useMemo } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { translate } from "@/localization/translate"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { useListingsQuery } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { FavoritesEmptyState } from "./components/FavoritesEmptyState"
import { FavoritesListingItem } from "./components/FavoritesListingItem"
import { $styles } from "./styles"

interface FavoritesScreenProps extends MainTabScreenProps<"Favorites"> {}

export const FavoritesScreen: FC<FavoritesScreenProps> = memo(function FavoritesScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props
  const { favorites, isAuthenticated } = useAuth()

  const { data: apiListings, isLoading } = useListingsQuery()

  const allListings = useMemo(() => {
    if (apiListings && apiListings.length > 0) return apiListings
    return [
      {
        _id: "mock-1",
        title: translate("mocks:tractorTitle"),
        price: 40000,
        unit: "",
        location: { address: translate("mocks:berkane") },
        images: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7QZZ3bZF_e8cOxBTJmidTtClk1LVtWkra_JJOiMzbWMyTLMk5g5FGMK5OzkKkfBXxxEHKwI3a7YlIuNEVO7s_G9kXqn989D3HdyVGs1uW7ckB17Y4dVjlEOqUyjG4crtfM49GIpO5sfOENTmzLi6Cd7LkkWNwI8MFbRmLWM7uBJAKVc9CTea3pe_bkDAUE4RKojfPf740h2bjBqBUY4A8fJdjPAe1JGxkLMOcenQrksvIg3KZQi9F6_quDNtsfaAHIXD-65BilWCh",
          },
        ],
        sellerId: { phone: "0600000000" },
        isNew: false,
        rating: 4.8,
      },
      {
        _id: "mock-2",
        title: translate("mocks:sheepTitle"),
        price: 3500,
        unit: translate("mocks:headUnit"),
        location: { address: translate("mocks:settat") },
        images: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9p5kNv4_sFkTNZrXA0Axqh9lLikFYaXS7PdTyp5f1KobcHbAsxe-pkIks-heFxy1SExRiKonOCYjKoj13bqKRvR94nAwbQLdEWKU-I8r7buF6MFuw0SSEQf2DZVHKMIjSOV97mu-TXSettLkAGOoX5BE9T7XeEAPNFDDJmIzxtxEJzco2wp_KhwU7jKOBtDemJv-Py5eCk6XV3qEaFdsHPx0Xpe37SaMaZ7SPTDL80wIHA6OuSnbTaUjuyJQ9D8X1Nnvaob7tyCyN",
          },
        ],
        sellerId: { phone: "0600000000" },
        isNew: true,
        rating: 4.9,
      },
    ]
  }, [apiListings])

  const favoritedListings = useMemo(() => {
    return (allListings as any[]).filter((item) => favorites.includes(item._id))
  }, [allListings, favorites])

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
      return <FavoritesListingItem item={item} onPress={() => handleListingDetails(item._id)} />
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
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text
          tx="common:favorites"
          style={styles.headerTitle}
          preset="bold"
        />
        <View style={styles.headerSpacer} />
      </View>

      {/* Main content using FlatList */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={favoritedListings}
          keyExtractor={(item) => item._id}
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
