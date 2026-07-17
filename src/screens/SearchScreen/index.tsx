import React, { FC, useState, memo, useCallback, useMemo, useEffect } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import {
  useListingsQuery,
  useCategoriesQuery,
  useLocationsQuery,
  useUnreadNotificationsCountQuery,
} from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { SearchHeader } from "./components/SearchHeader"
import { SearchListingItem } from "./components/SearchListingItem"
import { $styles } from "./styles"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface SearchScreenProps extends MainTabScreenProps<"Search"> {}

export const SearchScreen: FC<SearchScreenProps> = memo(function SearchScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { navigation } = props

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCat, setSelectedCat] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
      setDebouncedMinPrice(minPrice)
      setDebouncedMaxPrice(maxPrice)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [query, minPrice, maxPrice])

  const searchParams = useMemo(() => {
    return {
      search: debouncedQuery.trim() || undefined,
      categoryId: selectedCat !== "all" ? selectedCat : undefined,
      minPrice: debouncedMinPrice ? parseFloat(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : undefined,
      province: selectedCity !== "all" ? selectedCity : undefined,
    }
  }, [debouncedQuery, selectedCat, debouncedMinPrice, debouncedMaxPrice, selectedCity])

  const { data: apiListings, isLoading } = useListingsQuery(searchParams)
  const { data: categories } = useCategoriesQuery()
  const { data: unreadCount } = useUnreadNotificationsCountQuery()
  const { data: dbProvinces } = useLocationsQuery({ type: "province" })

  const filteredListings = apiListings || []

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleListingDetails = useCallback(
    (id: string) => {
      navigation.navigate("ListingDetails", { listingId: id })
    },
    [navigation],
  )

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={colors.palette.primary}
          style={{ marginTop: 40 }}
        />
      )
    }
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Ionicons name="search-outline" size={48} color={colors.palette.outline} />
        <Text
          tx="common:noResults"
          preset="bold"
          style={{ color: colors.palette.onSurfaceVariant, marginTop: 12 }}
        />
      </View>
    )
  }, [isLoading, colors])

  const renderListingItem = useCallback(
    ({ item }: { item: any }) => {
      return <SearchListingItem item={item} onPress={() => handleListingDetails(item._id)} />
    },
    [handleListingDetails],
  )

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={[styles.container]}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
        </TouchableOpacity>
        <Text tx="search:title" style={styles.headerTitle} preset="display" />
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.palette.primary} />
          {!!unreadCount && unreadCount > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
      </View>

      {/* Results loop inside FlatList */}
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item._id}
        renderItem={renderListingItem}
        ListHeaderComponent={
          <SearchHeader
            styles={styles}
            query={query}
            setQuery={setQuery}
            selectedCity={selectedCity}
            onPressLocation={() => setIsProvinceModalVisible(true)}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            resultsCount={filteredListings.length}
            categories={categories}
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: isLoading ? 0.6 : 1 }}
      />

      {/* Province Selection Modal */}
      <Modal visible={isProvinceModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                text={translate("search:selectCity")}
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsProvinceModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ _id: "all", name: "all" }, ...(dbProvinces || [])]}
              keyExtractor={(item: any) => item._id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCity(item._id === "all" ? "all" : item.name)
                    setIsProvinceModalVisible(false)
                  }}
                >
                  <Text
                    text={item._id === "all" ? translate("common:all") : item.name}
                    style={{ textAlign: "left", width: "100%" }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

export default SearchScreen
