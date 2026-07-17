import React, { FC, memo, useCallback, useState, useEffect } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { useCategoriesQuery, useUnreadNotificationsCountQuery } from "@/services/api/hooks"
import { getListings } from "@/services/api/modules/listings"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"
import { HomeListingItem } from "./components/HomeListingItem"
import { HomeHeader } from "./components/HomeHeader"

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = memo(function HomeScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [listings, setListings] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)

  const { data: categories, refetch: refetchCategories } = useCategoriesQuery()
  const { data: unreadCount } = useUnreadNotificationsCountQuery()

  const fetchListings = useCallback(
    async (pageNum: number, isRefresh: boolean) => {
      if (pageNum === 1) {
        setHasMore(true)
        if (isRefresh) {
          setIsRefreshing(true)
        }
      } else {
        setIsLoadingMore(true)
      }

      try {
        const res = await getListings({
          categoryId: selectedCategoryId,
          page: pageNum,
          limit: 10,
        })

        if (res.kind === "ok") {
          const newListings = res.listings || []
          if (pageNum === 1) {
            setListings(newListings)
          } else {
            setListings((prev) => {
              const existingIds = new Set(prev.map((item) => item._id))
              const filtered = newListings.filter((item) => !existingIds.has(item._id))
              return [...prev, ...filtered]
            })
          }
          setHasMore(newListings.length === 10)
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error("Error fetching listings:", error)
        setHasMore(false)
      } finally {
        setIsRefreshing(false)
        setIsLoadingMore(false)
        setFirstLoad(false)
      }
    },
    [selectedCategoryId],
  )

  // Fetch initial page on mount and when category changes
  useEffect(() => {
    setPage(1)
    fetchListings(1, true)
  }, [selectedCategoryId, fetchListings])

  const handleRefresh = useCallback(() => {
    setPage(1)
    fetchListings(1, true)
    refetchCategories()
  }, [fetchListings, refetchCategories])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchListings(nextPage, false)
    }
  }, [page, hasMore, isLoadingMore, isRefreshing, fetchListings])

  const handleAddPress = useCallback(() => {
    navigation.navigate("Add")
  }, [navigation])

  const handleListingDetails = useCallback(
    (id: string) => {
      navigation.navigate("ListingDetails", { listingId: id })
    },
    [navigation],
  )

  const renderListingCard = useCallback(
    ({ item }: { item: any }) => {
      return <HomeListingItem item={item} onPress={() => handleListingDetails(item._id)} />
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
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu-outline" size={28} color={colors.palette.primary} />
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
      {firstLoad && listings.length === 0 ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={renderListingCard}
          ListHeaderComponent={renderHomeHeader}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() =>
            isLoadingMore ? (
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
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </Screen>
  )
})

export default HomeScreen
