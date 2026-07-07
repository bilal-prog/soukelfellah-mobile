import React, { FC, memo, useCallback, useMemo } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useListingDetailsQuery } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"

interface ListingDetailsScreenProps extends AppStackScreenProps<"ListingDetails"> {}

const MOCK_DETAILS = {
  _id: "mock-1",
  title: "Tractor Mock",
  description: "Tractor Mock Description",
  price: 50000,
  unit: "",
  location: { address: "Settat" },
  images: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCaC9Spsu2PAgtVkgEX20XTgTk1OHOxBn0PuKri6e8AVM0R-l1fFUkaUh1ylJMQItQUr07NZYPzaed1lABrrmKASKbnU8Wlp3JKEcTIbVyxkxrQx7dXFBD3s45xcVRqToSJDml27-QOyDsMqs_qOLY8MZ_O9X3cOYutwIrJdHybG4zxMXk4bC50CP4Er6XL1GxeHKMupxbBioR6GsrxCvCySlkFt0WpLTbcdnhGnXTgQHLD4JXGO_u_QoMc_9ctpusP2UXZmu1DePVs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBvnZ2N2R-RvV1Bbk6oXrMwjXpx_mTC4O2_B-wfYWEgk15ZRw3DCHFk6ezhHHbYiarQ1g_kIKVYwyJwByXIVQd1SWELTlKNBBNepHybrkNovlhJtbYCpoBNOIZj85_M9LzCLmqYwMnTxVIWs88-BXH-khT3nI0tQGLRNFcprUBBDxoNjRaScfMFlHtXeL4H3Ke6_8lJ5dTX-bcxLer5XuCPMHSbC-Kv9Wq9UtUbIk43lUkogEPEGuguSsB4MMixdMbWSDoD9HPF0Rrq",
  ],
  sellerId: {
    firstName: "Seller Mock",
    lastName: "",
    phone: "0661234567",
    avatarFileId: null,
  },
  model: "2018",
  hours: "1200 hours",
}

export const ListingDetailsScreen: FC<ListingDetailsScreenProps> = memo(
  function ListingDetailsScreen(props) {
    const { theme } = useAppTheme()
    const colors = theme.colors
    const styles = $styles(theme)
    const { navigation, route } = props
    const { listingId } = route.params
    const { toggleFavorite, isFavorite, isAuthenticated, setGuestMode } = useAuth()

    const favorited = isFavorite(listingId)

    // Request listing from API
    const { data: apiListing, isLoading } = useListingDetailsQuery(listingId)

    const listing = useMemo<any>(() => {
      if (apiListing) return apiListing
      return {
        ...MOCK_DETAILS,
        title: translate("mocks:tractorTitle"),
        description: translate("mocks:tractorDesc"),
        location: { address: `📍 ${translate("mocks:settat")}` },
        sellerId: {
          ...MOCK_DETAILS.sellerId,
          firstName: translate("common:seller"),
        },
        hours: `1200 ${translate("common:hoursUnit")}`,
      }
    }, [apiListing])

    const handleGoBack = useCallback(() => {
      navigation.goBack()
    }, [navigation])

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
      checkAuthAndExecute(() => toggleFavorite(listingId))
    }, [checkAuthAndExecute, toggleFavorite, listingId])

    const handleCall = useCallback(() => {
      checkAuthAndExecute(() => {
        const phone = typeof listing.sellerId === "object" ? listing.sellerId?.phone : "0661234567"
        Linking.openURL(`tel:${phone}`)
      })
    }, [checkAuthAndExecute, listing])

    const handleWhatsapp = useCallback(() => {
      checkAuthAndExecute(() => {
        const phone = typeof listing.sellerId === "object" ? listing.sellerId?.phone : "0661234567"
        const formattedPhone = phone.startsWith("0") ? `+212${phone.slice(1)}` : phone
        const message = `${translate("common:whatsappMessage")}"${listing.title}"`
        Linking.openURL(
          `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`,
        )
      })
    }, [checkAuthAndExecute, listing])

    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.palette.primary} />
        </View>
      )
    }

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
          </TouchableOpacity>
          <Text tx="listingDetails:title" style={styles.headerTitle} preset="bold" />

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleFavoritePress}>
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={26}
                color={favorited ? colors.palette.error : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-social-outline" size={26} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gallery Carousel */}
          <View style={styles.galleryContainer}>
            <Image
              source={{
                uri:
                  typeof listing.images[0] === "object"
                    ? listing.images[0]?.url
                    : listing.images[0],
              }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
            <View style={styles.indicators}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Product Details Section */}
          <View style={styles.infoContainer}>
            {/* Title & Pricing */}
            <View style={styles.priceTitleSection}>
              <View style={styles.priceRow}>
                {listing.priceType === "CONTACT" ? (
                  <Text text={translate("addListing:priceTypeContact")} preset="display" style={styles.priceText} />
                ) : (
                  <>
                    <Text text={`${listing.price} ${translate("common:currency")}`} preset="display" style={styles.priceText} />
                    {listing.priceType === "NEGOTIABLE" && (
                      <View style={styles.negotiationBadge}>
                        <Text
                          tx="common:negotiable"
                          size="xxs"
                          preset="bold"
                          style={{ color: colors.palette.primary }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
              <Text text={listing.title} preset="bold" size="lg" style={styles.titleText} />
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.palette.onSurfaceVariant}
                />
                <Text text={listing.location.address} size="xs" style={styles.locationText} />
              </View>
            </View>

            {/* Seller Profile Card */}
            <View style={styles.sellerCard}>
              <View style={styles.sellerLeft}>
                <View style={styles.sellerAvatar}>
                  <Ionicons name="person" size={24} color={colors.palette.onSecondaryContainer} />
                </View>
                <View>
                  <Text
                    text={
                      typeof listing.sellerId === "object"
                        ? `${listing.sellerId?.firstName || ""} ${listing.sellerId?.lastName || ""}`.trim() ||
                          translate("common:seller")
                        : translate("common:seller")
                    }
                    preset="bold"
                    size="sm"
                  />
                  <Text
                    text={`${translate("listingDetails:memberSince")} 2022`}
                    size="xxs"
                    style={styles.locationText}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.sellerChevronBtn}>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={22}
                  color={colors.palette.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            {/* Specs Bento Grid */}
            {listing.listingType === "EQUIPMENT" && (
              <View style={styles.specsGrid}>
                <View style={styles.specBox}>
                  <Ionicons name="calendar-outline" size={20} color={colors.palette.primary} />
                  <Text tx="listingDetails:specs.model" size="xxs" style={styles.locationText} />
                  <Text text={listing.modelYear || translate("common:notSpecified")} preset="bold" size="xs" />
                </View>
                <View style={styles.specBox}>
                  <Ionicons name="time-outline" size={20} color={colors.palette.primary} />
                  <Text tx="listingDetails:specs.hours" size="xxs" style={styles.locationText} />
                  <Text
                    text={
                      listing.hours
                        ? isNaN(Number(listing.hours))
                          ? String(listing.hours)
                          : `${listing.hours} ${translate("common:hoursUnit")}`
                        : translate("common:notSpecified")
                    }
                    preset="bold"
                    size="xs"
                  />
                </View>
                {listing.condition && (
                  <View style={styles.specBox}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={colors.palette.primary} />
                    <Text tx="addListing:conditionLabel" size="xxs" style={styles.locationText} />
                    <Text
                      text={
                        listing.condition === "NEW"
                          ? translate("addListing:conditionNew")
                          : translate("addListing:conditionUsed")
                      }
                      preset="bold"
                      size="xs"
                    />
                  </View>
                )}
              </View>
            )}

            {/* Description Section */}
            <View style={styles.descSection}>
              <Text
                tx="listingDetails:productInfo"
                preset="bold"
                size="sm"
                style={styles.descTitle}
              />
              <View style={styles.descBox}>
                <Text text={listing.description} style={styles.descText} size="xs" />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Panel */}
        <View style={styles.fixedBottomActions}>
          <TouchableOpacity
            onPress={handleCall}
            style={[styles.ctaBtn, { backgroundColor: colors.palette.primary }]}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text tx="common:call" style={styles.ctaTextCall} preset="bold" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWhatsapp}
            style={[
              styles.ctaBtn,
              {
                borderWidth: 2,
                borderColor: colors.palette.secondary,
                backgroundColor: "transparent",
              },
            ]}
          >
            <Ionicons name="logo-whatsapp" size={20} color={colors.palette.secondary} />
            <Text tx="common:whatsapp" style={styles.ctaTextWa} preset="bold" />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  },
)

export default ListingDetailsScreen
