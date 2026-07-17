import React, { memo } from "react"
import { View, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { CategoryCard } from "@/components/CategoryCard"
import { Text } from "@/components/Text"
import { ApiCategory } from "@/services/api/modules"
import { useAppTheme } from "@/theme/context"

export interface HomeHeaderProps {
  styles: any
  categories?: ApiCategory[]
  selectedCategoryId?: string
  onSelectCategory?: (id: string | undefined) => void
}

const defaultMockCategories: ApiCategory[] = [
  { _id: "mock-cat-1", name: "Produce", slug: "produce", icon: undefined },
  { _id: "mock-cat-2", name: "Machinery", slug: "machinery", icon: undefined },
  { _id: "mock-cat-3", name: "Livestock", slug: "livestock", icon: undefined },
  { _id: "mock-cat-4", name: "Fertilizers", slug: "fertilizers", icon: undefined },
  { _id: "mock-cat-5", name: "Seeds", slug: "seeds", icon: undefined },
]

export const HomeHeader = memo(function HomeHeader({
  styles,
  categories,
  selectedCategoryId,
  onSelectCategory,
}: HomeHeaderProps) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const navigation = useNavigation<any>()

  const handleSearchPress = () => {
    navigation.navigate("Search")
  }

  const getCategoryEmoji = (slug: string) => {
    const lower = slug.toLowerCase()
    if (lower.includes("fruit")) return "🍎"
    if (lower.includes("veg")) return "🥕"
    if (lower.includes("equip") || lower.includes("machine") || lower.includes("tract")) return "🚜"
    if (lower.includes("live") || lower.includes("animal")) return "🐂"
    if (lower.includes("fertiliz")) return "💊"
    if (lower.includes("seed")) return "🧺"
    return "🌾"
  }

  const hasIconFile = (icon: any) => {
    if (!icon) return false
    if (typeof icon === "object" && icon.url) return true
    if (typeof icon === "string") {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(icon)
      const isUrl = icon.startsWith("http") || icon.startsWith("/")
      return isObjectId || isUrl
    }
    return false
  }

  const displayCategories = categories && categories.length > 0 ? categories : defaultMockCategories

  return (
    <View>
      {/* Search Input Box */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity activeOpacity={0.9} style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search-outline" size={22} color={colors.palette.onSurfaceVariant} />
          <Text tx="home:searchPlaceholder" style={styles.searchTextPlaceholder} />
        </TouchableOpacity>
      </View>

      {/* Categories Carousel */}
      <View style={styles.categoriesContainer}>
        <Text tx="home:categoriesTitle" preset="subheading" style={styles.sectionTitle} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {displayCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat._id
            return (
              <CategoryCard
                key={cat._id}
                label={cat.name}
                icon={hasIconFile(cat.icon) ? cat.icon : getCategoryEmoji(cat.slug)}
                selected={isSelected}
                onPress={() => {
                  if (onSelectCategory) {
                    onSelectCategory(isSelected ? undefined : cat._id)
                  }
                }}
              />
            )
          })}
        </ScrollView>
      </View>

      {/* Listings Section Header */}
      <View style={styles.sectionHeader}>
        {/* <Text tx="home:recentTitle" preset="subheading" style={styles.sectionTitle} /> */}
        <TouchableOpacity onPress={handleSearchPress}>
          <Text tx="home:viewAll" size="xs" style={styles.viewAllText} preset="bold" />
        </TouchableOpacity>
      </View>
    </View>
  )
})
