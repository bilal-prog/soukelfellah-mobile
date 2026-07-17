import React, { FC, useState, memo, useCallback, useMemo } from "react"
import { View, TouchableOpacity, ActivityIndicator, FlatList, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { useListingsQuery, useCategoriesQuery, useLocationsQuery } from "@/services/api/hooks"
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
  const [selectedCat, setSelectedCat] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)

  const { data: apiListings, isLoading } = useListingsQuery()
  const { data: categories } = useCategoriesQuery()
  const { data: dbProvinces } = useLocationsQuery({ type: "province" })

  const filteredListings = useMemo(() => {
    const source = apiListings || []

    return (source as any[]).filter((item: any) => {
      if (query.trim()) {
        const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase())
        const matchesDesc = item.description?.toLowerCase().includes(query.toLowerCase()) || false
        if (!matchesTitle && !matchesDesc) return false
      }

      if (selectedCat !== "all") {
        const itemCategoryId =
          typeof item.categoryId === "object" ? item.categoryId?._id : item.categoryId
        if (itemCategoryId !== selectedCat) return false
      }

      if (minPrice) {
        if (item.price < parseFloat(minPrice)) return false
      }
      if (maxPrice) {
        if (item.price > parseFloat(maxPrice)) return false
      }

      if (selectedCity !== "all") {
        const provinceMatch = item.location?.province
          ?.toLowerCase()
          .includes(selectedCity.toLowerCase())
        const addressMatch = item.location?.address
          ?.toLowerCase()
          .includes(selectedCity.toLowerCase())
        if (!provinceMatch && !addressMatch) return false
      }

      return true
    })
  }, [apiListings, query, selectedCat, minPrice, maxPrice, selectedCity])

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleListingDetails = useCallback(
    (id: string) => {
      navigation.navigate("ListingDetails", { listingId: id })
    },
    [navigation],
  )

  const renderListingItem = useCallback(
    ({ item }: { item: any }) => {
      return <SearchListingItem item={item} onPress={() => handleListingDetails(item._id)} />
    },
    [handleListingDetails],
  )

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={[styles.container, $bottomContainerInsets]}
    >
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
        </TouchableOpacity>
        <Text tx="search:title" style={styles.headerTitle} preset="display" />
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Results loop inside FlatList */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
      ) : (
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
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

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
