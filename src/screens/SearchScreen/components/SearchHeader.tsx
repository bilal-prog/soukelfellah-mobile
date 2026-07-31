import React, { memo } from "react"
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { translate } from "@/localization/translate"
import { ApiCategory } from "@/services/api/modules"
import { useAppTheme } from "@/theme/context"
import { s } from "@/utils/scaling"

export interface SearchHeaderProps {
  styles: any
  query: string
  setQuery: (val: string) => void
  selectedRegion?: any
  onPressRegion: () => void
  selectedProvince?: any
  onPressProvince: () => void
  selectedCommune?: any
  onPressCommune: () => void
  selectedCat: string
  setSelectedCat: (val: string) => void
  minPrice: string
  setMinPrice: (val: string) => void
  maxPrice: string
  setMaxPrice: (val: string) => void
  resultsCount: number
  categories?: ApiCategory[]
}

const defaultMockCategories = [
  { _id: "produce", name: "Produce", slug: "produce" },
  { _id: "machinery", name: "Machinery", slug: "machinery" },
  { _id: "livestock", name: "Livestock", slug: "livestock" },
  { _id: "fertilizers", name: "Fertilizers", slug: "fertilizers" },
]

export const SearchHeader = memo(function SearchHeader(props: SearchHeaderProps) {
  const {
    styles,
    query,
    setQuery,
    selectedRegion,
    onPressRegion,
    selectedProvince,
    onPressProvince,
    selectedCommune,
    onPressCommune,
    selectedCat,
    setSelectedCat,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    resultsCount,
    categories,
  } = props

  const { theme } = useAppTheme()
  const colors = theme.colors

  const displayCategories = categories && categories.length > 0 ? categories : defaultMockCategories

  return (
    <View>
      {/* Search bar & Location pickers */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.palette.onSurfaceVariant} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={translate("search:inputPlaceholder")}
            placeholderTextColor={colors.palette.onSurfaceVariant}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.locationRow}>
          {/* Region Picker Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressRegion}
            style={styles.locationHalfButton}
          >
            <View style={styles.locationBtnLeft}>
              <Ionicons name="map-outline" size={s(18)} color={colors.palette.primary} />
              <Text
                text={
                  selectedRegion && selectedRegion._id !== "all"
                    ? selectedRegion.name
                    : translate("addListing:regionLabel")
                }
                size="xs"
                preset="bold"
                numberOfLines={1}
                style={{ flex: 1, textAlign: "left" }}
              />
            </View>
            <Ionicons name="chevron-down" size={s(16)} color={colors.palette.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Province Picker Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressProvince}
            style={styles.locationHalfButton}
          >
            <View style={styles.locationBtnLeft}>
              <Ionicons name="location-outline" size={s(18)} color={colors.palette.secondary} />
              <Text
                text={
                  selectedProvince && selectedProvince._id !== "all"
                    ? selectedProvince.name
                    : translate("addListing:provinceLabel")
                }
                size="xs"
                preset="bold"
                numberOfLines={1}
                style={{ flex: 1, textAlign: "left" }}
              />
            </View>
            <Ionicons name="chevron-down" size={s(16)} color={colors.palette.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Commune Picker Button (Optional) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressCommune}
          style={styles.locationFullButton}
        >
          <View style={styles.locationBtnLeft}>
            <Ionicons name="navigate-outline" size={s(18)} color={colors.palette.tertiary || colors.palette.primary} />
            <Text
              text={
                selectedCommune && selectedCommune._id !== "all"
                  ? selectedCommune.name
                  : translate("addListing:communeLabel")
              }
              size="xs"
              preset="bold"
              numberOfLines={1}
              style={{ flex: 1, textAlign: "left" }}
            />
          </View>
          <Ionicons name="chevron-down" size={s(16)} color={colors.palette.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Categories Chips */}
      <View style={styles.categoriesContainer}>
        <Text tx="search:categoriesSection" preset="subheading" style={styles.sectionTitle} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryChipsScroll}
        >
          {/* All Chip */}
          <TouchableOpacity
            onPress={() => setSelectedCat("all")}
            style={[
              styles.chipItem,
              selectedCat === "all" ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              tx="search:allCategories"
              size="xs"
              preset="bold"
              style={selectedCat === "all" ? styles.chipTextActive : styles.chipTextInactive}
            />
          </TouchableOpacity>

          {/* Dynamic Categories */}
          {displayCategories.map((cat) => {
            const active = selectedCat === cat._id
            return (
              <TouchableOpacity
                key={cat._id}
                onPress={() => setSelectedCat(cat._id)}
                style={[styles.chipItem, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text
                  text={cat.name}
                  size="xs"
                  preset="bold"
                  style={active ? styles.chipTextActive : styles.chipTextInactive}
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Price Range Box */}
      <View style={styles.priceRangeContainer}>
        <Text tx="search:priceRange" preset="subheading" style={styles.sectionTitle} />
        <View style={styles.priceInputsRow}>
          <View style={styles.priceInputWrapper}>
            <Text tx="search:priceTo" size="xxs" style={styles.priceLabel} preset="bold" />
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="10000"
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
          <View style={styles.priceInputWrapper}>
            <Text tx="search:priceFrom" size="xxs" style={styles.priceLabel} preset="bold" />
            <TextInput
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="0"
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={{ color: colors.text }} preset="bold">
          <Text tx="search:resultsCount" />{" "}
          <Text
            text={`(${resultsCount})`}
            style={{ color: colors.palette.primary }}
            preset="bold"
          />
        </Text>
      </View>
    </View>
  )
})
