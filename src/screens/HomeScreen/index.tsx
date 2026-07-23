import React, { FC, memo, useCallback, useState, useMemo } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import {
  useCategoriesQuery,
  useUnreadNotificationsCountQuery,
  useInfiniteListingsQuery,
} from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"
import { HomeListingItem } from "./components/HomeListingItem"
import { HomeHeader } from "./components/HomeHeader"
import { s } from "@/utils/scaling"

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = memo(function HomeScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props

  // Category filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)

  // Fetch reference categories and unread notifications count via React Query
  const { data: categories, refetch: refetchCategories } = useCategoriesQuery()
  const { data: unreadCount } = useUnreadNotificationsCountQuery()

  // Fetch paginated feed listings using useInfiniteQuery under the hood
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch: refetchListings,
  } = useInfiniteListingsQuery({
    categoryId: selectedCategoryId,
  })

  // Flatten the page queries returned by useInfiniteQuery
  const listings = useMemo(() => {
    return data?.pages.flat() || []
  }, [data])

  useFocusEffect(
    useCallback(() => {
      refetchListings()
    }, [refetchListings]),
  )

  // Pull-to-refresh state and handler
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Re-fetch all queries simultaneously
      await Promise.all([refetchListings(), refetchCategories()])
    } catch (error) {
      console.error("Error refreshing home feed data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refetchListings, refetchCategories])

  // Fetch next page when reaching lists end
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isRefreshing) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isRefreshing])

  const handleAddPress = useCallback(() => {
    navigation.navigate("Add")
  }, [navigation])

  const handleProfilePress = useCallback(() => {
    navigation.navigate("MyAccount")
  }, [navigation])

  const handleListingDetails = useCallback(
    (id: string) => {
      navigation.navigate("ListingDetails", { listingId: id })
    },
    [navigation],
  )

  const renderListingCard = useCallback(
    ({ item }: { item: any }) => {
      return <HomeListingItem item={item} onPress={() => handleListingDetails(item?._id)} />
    },
    [handleListingDetails],
  )

  const renderHomeHeader = useCallback(() => {
    return (
      <HomeHeader
        styles={styles}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
    )
  }, [styles, categories, selectedCategoryId])

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={28} color={colors.palette.primary} />
        </TouchableOpacity>
        <Text tx="home:title" style={styles.headerTitle} preset="display" />
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.palette.primary} />
          {!!unreadCount && unreadCount > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Main listings feed using FlatList */}
      {isLoading && listings.length === 0 ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item?._id}
          renderItem={renderListingCard}
          ListHeaderComponent={renderHomeHeader}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ paddingVertical: 16 }}
              />
            ) : null
          }
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleAddPress} style={styles.fab}>
        <Ionicons name="add" size={s(32)} color="white" />
      </TouchableOpacity>
    </Screen>
  )
})

export default HomeScreen
