import React, { memo } from "react"

import { ListingCard } from "@/components/ListingCard"
import { formatFullAddress } from "@/utils/formatAddress"
import { getUnitDisplayName } from "@/utils/unit"

interface FavoritesListingItemProps {
  item: any
  onPress: () => void
}

export const FavoritesListingItem = memo(function FavoritesListingItem({
  item,
  onPress,
}: FavoritesListingItemProps) {
  return (
    <ListingCard
      id={item?._id}
      title={item.title}
      categoryName={typeof item.categoryId === "object" ? item.categoryId?.name : undefined}
      productTypeName={typeof item.productTypeId === "object" ? item.productTypeId?.name : undefined}
      price={item.price}
      priceType={item.priceType}
      purpose={item.purpose}
      listingDirection={item.listingDirection}
      listingType={item.listingType}
      quantity={item.quantity}
      unit={getUnitDisplayName(item.unitId || item.unit)}
      locationName={formatFullAddress(item.location)}
      imageUri={typeof item.images[0] === "object" ? item.images[0]?.url : item.images[0]}
      phone={typeof item.sellerId === "object" ? item.sellerId?.phone : undefined}
      sellerId={item.sellerId}
      isNew={item.isNew}
      rating={item.rating}
      createdAt={item.createdAt}
      onPress={onPress}
    />
  )
})
