import React, { memo } from "react"

import { ListingCard } from "@/components/ListingCard"

interface SearchListingItemProps {
  item: any
  onPress: () => void
}

export const SearchListingItem = memo(function SearchListingItem({
  item,
  onPress,
}: SearchListingItemProps) {
  return (
    <ListingCard
      id={item._id}
      title={item.title}
      price={item.price}
      priceType={item.priceType}
      purpose={item.purpose}
      listingDirection={item.listingDirection}
      unit={
        item.listingType !== "EQUIPMENT"
          ? typeof item.unitId === "object"
            ? item.unitId?.name
            : item.unit || undefined
          : undefined
      }
      locationName={item.location.address}
      imageUri={typeof item.images[0] === "object" ? item.images[0]?.url : item.images[0]}
      phone={typeof item.sellerId === "object" ? item.sellerId?.phone : "0600000000"}
      isNew={item.isNew}
      rating={item.rating}
      onPress={onPress}
    />
  )
})
