import React from "react"
import { View, ScrollView, ViewStyle } from "react-native"
import { Skeleton } from "./Skeleton"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

/**
 * Skeleton loader for horizontal Categories carousel on HomeScreen.
 */
export const CategoryListSkeleton: React.FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: s(12), paddingVertical: vs(8) }}
    >
      {[1, 2, 3, 4, 5].map((key) => (
        <View key={key} style={$categorySkeletonContainer}>
          <Skeleton width={s(70)} height={s(70)} borderRadius={s(8)} />
          <Skeleton width={s(60)} height={vs(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
        </View>
      ))}
    </ScrollView>
  )
}

/**
 * Single Listing Card skeleton matching ListingCard layout.
 */
export const ListingCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  return (
    <View
      style={[
        $cardContainer,
        { backgroundColor: colors.background, borderColor: colors.palette.outlineVariant },
        style,
      ]}
    >
      {/* Listing Cover Image Skeleton */}
      <Skeleton width="100%" height={vs(190)} borderRadius={0} />

      {/* Info Content Section */}
      <View style={{ padding: s(12) }}>
        {/* Title Lines */}
        <Skeleton width="85%" height={vs(18)} borderRadius={s(4)} />
        <Skeleton width="55%" height={vs(14)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />

        {/* Location & Date Row */}
        <View style={$rowBetween}>
          <Skeleton width={s(110)} height={vs(14)} borderRadius={s(4)} />
          <Skeleton width={s(60)} height={vs(14)} borderRadius={s(4)} />
        </View>

        {/* Price Tag Line */}
        <View style={{ marginTop: vs(12) }}>
          <Skeleton width={s(130)} height={vs(22)} borderRadius={s(6)} />
        </View>

        {/* Action Buttons Row */}
        <View style={$actionRow}>
          <Skeleton width="48%" height={vs(42)} borderRadius={s(8)} />
          <Skeleton width="48%" height={vs(42)} borderRadius={s(8)} />
        </View>
      </View>
    </View>
  )
}

/**
 * List of Listing Card skeletons for home feed or search screen.
 */
export const ListingFeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={{ paddingHorizontal: s(12), paddingTop: vs(10) }}>
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} style={{ marginBottom: vs(16) }} />
      ))}
    </View>
  )
}

/**
 * Skeleton loader for full Listing Details Screen.
 */
export const ListingDetailsSkeleton: React.FC = () => {
  const { theme } = useAppTheme()
  const { colors } = theme

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Hero Image Carousel Skeleton */}
      <Skeleton width="100%" height={vs(280)} borderRadius={0} />

      <View style={{ padding: s(16) }}>
        {/* Title Block */}
        <Skeleton width="90%" height={vs(24)} borderRadius={s(4)} />
        <Skeleton width="60%" height={vs(18)} borderRadius={s(4)} style={{ marginTop: vs(8) }} />

        {/* Price & Badge Pill */}
        <View style={$rowBetween}>
          <Skeleton width={s(140)} height={vs(30)} borderRadius={s(8)} />
          <Skeleton width={s(80)} height={vs(26)} borderRadius={s(14)} />
        </View>

        {/* Divider */}
        <View style={$divider} />

        {/* Seller Profile Box */}
        <View
          style={[
            $sellerBox,
            { backgroundColor: colors.palette.surfaceContainerLow, borderColor: colors.palette.outlineVariant },
          ]}
        >
          <Skeleton width={s(50)} height={s(50)} borderRadius={s(25)} />
          <View style={{ flex: 1, marginLeft: s(12) }}>
            <Skeleton width="60%" height={vs(16)} borderRadius={s(4)} />
            <Skeleton width="40%" height={vs(14)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        </View>

        {/* Location Section */}
        <View style={{ marginTop: vs(20) }}>
          <Skeleton width={s(120)} height={vs(18)} borderRadius={s(4)} />
          <Skeleton width="100%" height={vs(60)} borderRadius={s(10)} style={{ marginTop: vs(10) }} />
        </View>
      </View>
    </View>
  )
}

/**
 * Skeleton for Notification or Conversation list items.
 */
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const { theme } = useAppTheme()
  const { colors } = theme

  return (
    <View style={{ paddingHorizontal: s(16), paddingTop: vs(10) }}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            $itemRow,
            { borderBottomColor: colors.palette.outlineVariant },
          ]}
        >
          <Skeleton width={s(44)} height={s(44)} borderRadius={s(22)} />
          <View style={{ flex: 1, marginLeft: s(12) }}>
            <Skeleton width="75%" height={vs(16)} borderRadius={s(4)} />
            <Skeleton width="50%" height={vs(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
          </View>
        </View>
      ))}
    </View>
  )
}

const $categorySkeletonContainer: ViewStyle = {
  alignItems: "center",
  marginHorizontal: s(6),
}

const $cardContainer: ViewStyle = {
  borderRadius: s(12),
  borderWidth: 1,
  overflow: "hidden",
}

const $rowBetween: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: vs(10),
}

const $actionRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: vs(14),
}

const $divider: ViewStyle = {
  height: 1,
  backgroundColor: "#E5E7EB",
  marginVertical: vs(16),
}

const $sellerBox: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: s(12),
  borderRadius: s(12),
  borderWidth: 1,
}

const $itemRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: vs(12),
  borderBottomWidth: 1,
}
