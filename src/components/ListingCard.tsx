import { memo, useCallback } from "react"
import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import { useAppTheme } from "@/theme/context"

import { Text } from "./Text"

export interface ListingCardProps {
  id: string
  title: string
  price?: number
  priceType?: "FIXED" | "NEGOTIABLE" | "CONTACT"
  purpose?: "SELL" | "RENT"
  listingDirection?: "SELL" | "BUY"
  unit?: string
  locationName: string
  imageUri?: string
  phone: string
  whatsapp?: string
  isNew?: boolean
  rating?: number
  onPress?: () => void
}

export const ListingCard = memo(function ListingCard(props: ListingCardProps) {
  const {
    id,
    title,
    price,
    priceType = "FIXED",
    purpose = "SELL",
    listingDirection = "SELL",
    unit,
    locationName,
    imageUri,
    phone,
    whatsapp,
    isNew,
    rating,
    onPress,
  } = props
  const { theme } = useAppTheme()
  const { colors, spacing } = theme
  const { toggleFavorite, isFavorite, isAuthenticated, setGuestMode } = useAuth()

  const favorited = isFavorite(id)

  const checkAuthAndExecute = useCallback(
    (action: () => void) => {
      if (!isAuthenticated) {
        Alert.alert(translate("guest:contactAlertTitle"), translate("guest:contactAlertMsg"), [
          { text: translate("common:cancel"), style: "cancel" },
          {
            text: translate("guest:loginCta"),
            onPress: () => {
              setGuestMode(false)
            },
          },
        ])
        return
      }
      action()
    },
    [isAuthenticated, setGuestMode],
  )

  const handleFavoritePress = useCallback(() => {
    checkAuthAndExecute(() => toggleFavorite(id))
  }, [checkAuthAndExecute, toggleFavorite, id])

  const handleCall = useCallback(() => {
    checkAuthAndExecute(() => Linking.openURL(`tel:${phone}`))
  }, [checkAuthAndExecute, phone])

  const handleWhatsapp = useCallback(() => {
    checkAuthAndExecute(() => {
      const waPhone = whatsapp || phone
      const formattedPhone = waPhone.startsWith("0") ? `+212${waPhone.slice(1)}` : waPhone
      const message = translate("welcome:title")
      Linking.openURL(`whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`)
    })
  }, [checkAuthAndExecute, phone, whatsapp])

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[
        $cardContainer,
        {
          backgroundColor: colors.palette.surfaceContainerLowest,
          borderColor: colors.palette.outlineVariant,
        },
      ]}
    >
      {/* Image Block */}
      <View style={$imageWrapper}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={$image} resizeMode="cover" />
        ) : (
          <View
            style={[
              $image,
              $imagePlaceholder,
              { backgroundColor: colors.palette.surfaceContainer },
            ]}
          />
        )}

        {/* Badges */}
        {isNew && (
          <View style={[$badge, { backgroundColor: colors.palette.error, right: spacing.xs }]}>
            <Text tx="common:new" size="xxs" style={{ color: "white" }} />
          </View>
        )}

        {rating !== undefined && (
          <View
            style={[
              $ratingBadge,
              { backgroundColor: "rgba(255, 255, 255, 0.85)", left: spacing.xs },
            ]}
          >
            <Ionicons name="star" size={12} color={colors.palette.primary} />
            <Text
              text={String(rating)}
              size="xxs"
              style={{ color: colors.palette.onSurface, fontWeight: "bold" }}
            />
          </View>
        )}

        {/* Favorite Icon */}
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={[$favButton, { backgroundColor: "rgba(255, 255, 255, 0.85)" }]}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={18}
            color={favorited ? colors.palette.error : colors.palette.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {/* Info Content */}
      <View style={$infoContent}>
        <View style={[$row, { alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: spacing.xxs }]}>
          {listingDirection === "BUY" && (
            <View style={{ backgroundColor: colors.palette.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text text={translate("addListing:directionBuy")} size="xxs" style={{ color: "white", fontWeight: "bold" }} />
            </View>
          )}
          {purpose === "RENT" && (
            <View style={{ backgroundColor: colors.palette.tertiary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text text={translate("addListing:purposeRent")} size="xxs" style={{ color: "white", fontWeight: "bold" }} />
            </View>
          )}
          <Text
            text={title}
            preset="bold"
            size="sm"
            numberOfLines={1}
            style={{ color: colors.palette.onSurface, flex: 1 }}
          />
        </View>

        {/* Location Row */}
        <View style={[$row, { marginVertical: spacing.xxs }]}>
          <Ionicons name="location-outline" size={14} color={colors.palette.onSurfaceVariant} />
          <Text
            text={locationName}
            size="xxs"
            style={{ color: colors.palette.onSurfaceVariant, marginHorizontal: spacing.xxs }}
          />
        </View>

        {/* Pricing Row */}
        <View style={[$row, { justifyContent: "space-between", alignItems: "center" }]}>
          <Text preset="bold" size="sm" style={{ color: colors.palette.primary }}>
            {priceType === "CONTACT" ? (
              translate("addListing:priceTypeContact")
            ) : (
              <>
                {price}{" "}
                <Text
                  text={
                    priceType === "NEGOTIABLE"
                      ? `${translate("common:currency")}${unit ? `/${unit}` : ""} (${translate("addListing:priceTypeNegotiable")})`
                      : `${translate("common:currency")}${unit ? `/${unit}` : ""}`
                  }
                  size="xxs"
                />
              </>
            )}
          </Text>
        </View>

        {/* Contact Actions */}
        <View style={[$actionRow, { marginTop: spacing.xs }]}>
          <TouchableOpacity
            onPress={handleCall}
            style={[
              $actionButton,
              { backgroundColor: colors.palette.primary, marginRight: spacing.xxs },
            ]}
          >
            <Ionicons name="call" size={14} color="white" />
            <Text tx="common:call" size="xxs" style={$actionBtnText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWhatsapp}
            style={[$actionButton, $waButton, { borderColor: colors.palette.secondary }]}
          >
            <Ionicons name="logo-whatsapp" size={14} color={colors.palette.secondary} />
            <Text
              tx="common:whatsapp"
              size="xxs"
              style={[$actionBtnText, { color: colors.palette.secondary }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const $cardContainer: ViewStyle = {
  borderRadius: 12,
  borderWidth: 1,
  overflow: "hidden",
  marginBottom: 16,
  elevation: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
}

const $imageWrapper: ViewStyle = {
  position: "relative",
  aspectRatio: 1.5,
  width: "100%",
}

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $imagePlaceholder: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $badge: ViewStyle = {
  position: "absolute",
  top: 8,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 12,
  zIndex: 2,
}

const $ratingBadge: ViewStyle = {
  position: "absolute",
  top: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
  zIndex: 2,
}

const $favButton: ViewStyle = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3,
}

const $infoContent: ViewStyle = {
  padding: 12,
}

const $row: ViewStyle = {
  flexDirection: isRTL ? "row-reverse" : "row",
  alignItems: "center",
}

const $actionRow: ViewStyle = {
  flexDirection: isRTL ? "row-reverse" : "row",
  justifyContent: "space-between",
  gap: 20,
}

const $actionButton: ViewStyle = {
  flex: 1,
  height: 36,
  borderRadius: 8,
  flexDirection: isRTL ? "row-reverse" : "row",
  justifyContent: "center",
  alignItems: "center",
}

const $waButton: ViewStyle = {
  borderWidth: 1.5,
  backgroundColor: "transparent",
}

const $actionBtnText: TextStyle = {
  color: "white",
  fontWeight: "bold",
  marginHorizontal: 4,
}
