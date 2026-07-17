import React, { memo } from "react"
import { View, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { translate } from "@/localization/translate"
import { formatListingDate } from "@/utils/formatDate"

interface MyListingItemProps {
  item: any
  activeTab: string
  onMarkSold: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  styles: any
}

export const MyListingItem = memo(function MyListingItem({
  item,
  activeTab,
  onMarkSold,
  onDelete,
  onEdit,
  styles,
}: MyListingItemProps) {
  const imageUri =
    typeof item.images?.[0] === "object" ? item.images[0]?.url : item.images?.[0] || item.image
  const unitText =
    item.listingType !== "EQUIPMENT"
      ? typeof item.unitId === "object"
        ? item.unitId?.name
        : item.unit || ""
      : ""

  const getCreatedDateText = () => {
    if (!item.createdAt) {
      return item.daysAgo
        ? `${item.daysAgo} ${translate("common:days")}`
        : translate("common:today")
    }
    return formatListingDate(item.createdAt)
  }

  return (
    <View style={styles.listingCardWrapper}>
      {/* Horizontal row container */}
      <View style={styles.listingRow}>
        <Image source={{ uri: imageUri }} style={styles.listingImage} resizeMode="cover" />

        <View style={styles.listingInfo}>
          <View>
            <Text text={item.title} preset="bold" size="xs" numberOfLines={1} />
            {item.priceType === "CONTACT" ? (
              <Text
                text={translate("addListing:priceTypeContact")}
                preset="bold"
                size="xs"
                style={styles.listingPriceText}
              />
            ) : item.price !== undefined && item.price !== null && item.price !== "" ? (
              <Text
                text={`${item.price} ${translate("common:currency")}${unitText ? " / " + unitText : ""}${
                  item.priceType === "NEGOTIABLE"
                    ? ` (${translate("addListing:priceTypeNegotiable")})`
                    : ""
                }`}
                preset="bold"
                size="xs"
                style={styles.listingPriceText}
              />
            ) : null}
          </View>

          <View style={styles.listingMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={14} color={styles.metaText.color} />
              <Text
                text={`${item.viewsCount || 0} ${translate("common:views")}`}
                size="xxs"
                style={styles.metaText}
              />
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={styles.metaText.color} />
              <Text text={getCreatedDateText()} size="xxs" style={styles.metaText} />
            </View>
          </View>
        </View>
      </View>

      {/* Sub row action buttons */}
      {activeTab === "active" && (
        <View style={styles.listingActions}>
          <TouchableOpacity onPress={() => onEdit(item._id)} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={16} color={styles.actionTextEdit.color} />
            <Text tx="common:edit" size="xxs" style={styles.actionTextEdit} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onMarkSold(item._id)} style={styles.actionBtn}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={styles.actionTextSold.color}
            />
            <Text tx="common:sold" size="xxs" style={styles.actionTextSold} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item._id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={styles.deleteBtn.color || "#ff3b30"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})
