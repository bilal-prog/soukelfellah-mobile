import { FC, memo, useCallback, useMemo, useState } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native"
// eslint-disable-next-line no-restricted-imports
import { TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useListingDetailsQuery, useReportListingMutation } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { formatFullAddress } from "@/utils/formatAddress"

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
    createdAt: "2026-07-16T15:18:22Z",
  },
  model: "2018",
  hours: "1200 hours",
}

export const ListingDetailsScreen: FC<ListingDetailsScreenProps> = memo(
  function ListingDetailsScreen(props) {
    const { theme } = useAppTheme()
    const colors = theme.colors
    const styles = $styles(theme)
    const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
    const { navigation, route } = props
    const { listingId } = route.params
    const { toggleFavorite, isFavorite, isAuthenticated, setGuestMode } = useAuth()

    const favorited = isFavorite(listingId)

    const { width: screenWidth } = useWindowDimensions()
    const [activeIndex, setActiveIndex] = useState(0)

    const handleScroll = useCallback((event: any) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width
      if (slideSize === 0) return
      const index = event.nativeEvent.contentOffset.x / slideSize
      const roundIndex = Math.round(index)
      setActiveIndex(roundIndex)
    }, [])

    const [isViewerVisible, setIsViewerVisible] = useState(false)
    const [viewerIndex, setViewerIndex] = useState(0)

    const handleOpenViewer = useCallback((index: number) => {
      setViewerIndex(index)
      setIsViewerVisible(true)
    }, [])

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

    const [isReportModalVisible, setIsReportModalVisible] = useState(false)
    const [selectedReason, setSelectedReason] = useState<string>("SCAM")
    const [reportDescription, setReportDescription] = useState("")

    const { mutate: reportListing, isPending: isReporting } = useReportListingMutation()

    const handleReportPress = useCallback(() => {
      checkAuthAndExecute(() => {
        setIsReportModalVisible(true)
      })
    }, [checkAuthAndExecute])

    const handleReportSubmit = useCallback(() => {
      if (!selectedReason) {
        Alert.alert(translate("common:error"), translate("listingDetails:report.reasonLabel"))
        return
      }

      reportListing(
        {
          listingId,
          reason: selectedReason,
          description: reportDescription,
        },
        {
          onSuccess: () => {
            Alert.alert(
              translate("listingDetails:report.successTitle"),
              translate("listingDetails:report.successMsg"),
            )
            setIsReportModalVisible(false)
            setReportDescription("")
          },
          onError: (err: any) => {
            Alert.alert(
              translate("listingDetails:report.errorTitle"),
              err?.message || translate("listingDetails:report.errorMsg"),
            )
          },
        },
      )
    }, [listingId, selectedReason, reportDescription, reportListing])

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
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        style={[styles.container, $bottomContainerInsets]}
      >
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
          </TouchableOpacity>
          <Text tx="listingDetails:title" style={styles.headerTitle} preset="bold" />

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleReportPress}>
              <Ionicons name="flag-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavoritePress}>
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={26}
                color={favorited ? colors.palette.error : colors.text}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Ionicons name="share-social-outline" size={26} color={colors.text} />
            </TouchableOpacity> */}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Gallery Carousel */}
          <View style={styles.galleryContainer}>
            {listing.images && listing.images.length > 1 ? (
              <>
                <FlatList
                  data={listing.images}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_item: any, index: number) => index.toString()}
                  onMomentumScrollEnd={handleScroll}
                  renderItem={({ item, index }: { item: any; index: number }) => {
                    const imgUrl = typeof item === "object" ? item?.url : item
                    return (
                      <TouchableOpacity activeOpacity={0.9} onPress={() => handleOpenViewer(index)}>
                        <Image
                          source={{ uri: imgUrl }}
                          style={{ width: screenWidth, height: "100%" }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )
                  }}
                />
                <View style={styles.indicators}>
                  {listing.images.map((_item: any, index: number) => (
                    <View
                      key={index}
                      style={[styles.dot, activeIndex === index && styles.activeDot]}
                    />
                  ))}
                </View>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleOpenViewer(0)}
                style={{ width: "100%", height: "100%" }}
              >
                <Image
                  source={{
                    uri:
                      listing.images && listing.images.length > 0
                        ? typeof listing.images[0] === "object"
                          ? listing.images[0]?.url
                          : listing.images[0]
                        : undefined,
                  }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Product Details Section */}
          <View style={styles.infoContainer}>
            {/* Title & Pricing */}
            <View style={styles.priceTitleSection}>
              <View style={styles.priceRow}>
                {listing.priceType === "CONTACT" ? (
                  <Text
                    text={translate("addListing:priceTypeContact")}
                    preset="display"
                    style={styles.priceText}
                  />
                ) : (
                  <>
                    <Text
                      text={`${listing.price} ${translate("common:currency")}`}
                      preset="display"
                      style={styles.priceText}
                    />
                    {listing.priceType === "NEGOTIABLE" && (
                      <View style={styles.negotiationBadge}>
                        <Text
                          tx="common:negotiable"
                          size="xxs"
                          preset="bold"
                          style={styles.negotiableColor}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
              {/* Direction & Purpose Badges */}
              <View style={styles.badgesRow}>
                {listing.listingDirection === "BUY" ? (
                  <View style={styles.badgeBuy}>
                    <Text
                      text={translate("addListing:directionBuy")}
                      size="xxs"
                      style={styles.badgeText}
                    />
                  </View>
                ) : listing.purpose === "RENT" ? (
                  <View style={styles.badgeRent}>
                    <Text
                      text={translate("addListing:purposeRent")}
                      size="xxs"
                      style={styles.badgeText}
                    />
                  </View>
                ) : (
                  <View style={styles.badgeSell}>
                    <Text
                      text={translate("addListing:directionSell")}
                      size="xxs"
                      style={styles.badgeText}
                    />
                  </View>
                )}
              </View>
              <Text text={listing.title} preset="bold" size="lg" style={styles.titleText} />
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.palette.onSurfaceVariant}
                />
                <Text text={formatFullAddress(listing.location)} size="xs" style={styles.locationText} />
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
                    text={`${translate("listingDetails:memberSince")} ${
                      typeof listing.sellerId === "object" && listing.sellerId?.createdAt
                        ? new Date(listing.sellerId.createdAt).getFullYear()
                        : 2026
                    }`}
                    size="xxs"
                    style={styles.locationText}
                  />
                </View>
              </View>
            </View>

            {/* Specs Bento Grid */}
            {listing.listingType === "EQUIPMENT" && (
              <View style={styles.specsGrid}>
                <View style={styles.specBox}>
                  <Ionicons name="calendar-outline" size={20} color={colors.palette.primary} />
                  <Text tx="listingDetails:specs.model" size="xxs" style={styles.locationText} />
                  <Text
                    text={listing.modelYear || translate("common:notSpecified")}
                    preset="bold"
                    size="xs"
                  />
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
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color={colors.palette.primary}
                    />
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

          <TouchableOpacity onPress={handleWhatsapp} style={[styles.ctaBtn, styles.ctaBtnWhatsapp]}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.palette.secondary} />
            <Text tx="common:whatsapp" style={styles.ctaTextWa} preset="bold" />
          </TouchableOpacity>
        </View>
        {/* Report Modal */}
        <Modal
          visible={isReportModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsReportModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text tx="listingDetails:report.title" style={styles.modalTitle} preset="bold" />
                <TouchableOpacity onPress={() => setIsReportModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text tx="listingDetails:report.reasonLabel" size="xs" style={styles.modalSubtitle} />

              <View style={styles.reasonsContainer}>
                {(["SCAM", "SPAM", "INCORRECT", "OFFENSIVE", "OTHER"] as const).map((reason) => {
                  const isSelected = selectedReason === reason
                  const txKey = `listingDetails:report.reasons.${reason.toLowerCase()}` as any
                  return (
                    <TouchableOpacity
                      key={reason}
                      style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={isSelected ? colors.palette.primary : colors.palette.outline}
                      />
                      <Text
                        tx={txKey}
                        style={[styles.reasonText, isSelected && styles.reasonTextSelected]}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>

              <TextInput
                style={styles.descriptionInput}
                placeholder={translate("listingDetails:report.descriptionPlaceholder")}
                placeholderTextColor={colors.palette.outline}
                value={reportDescription}
                onChangeText={setReportDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                  onPress={() => setIsReportModalVisible(false)}
                  disabled={isReporting}
                >
                  <Text tx="listingDetails:report.cancel" style={styles.modalBtnTextCancel} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnSubmit]}
                  onPress={handleReportSubmit}
                  disabled={isReporting}
                >
                  {isReporting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      tx="listingDetails:report.submit"
                      style={styles.modalBtnTextSubmit}
                      preset="bold"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Full Screen Image Viewer Modal */}
        <Modal
          visible={isViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsViewerVisible(false)}
        >
          <View style={styles.imageViewerBackground}>
            <TouchableOpacity
              style={styles.imageViewerCloseBtn}
              onPress={() => setIsViewerVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>

            {listing.images && listing.images.length > 0 && (
              <FlatList
                data={listing.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_item: any, index: number) => index.toString()}
                initialScrollIndex={
                  viewerIndex >= 0 && viewerIndex < listing.images.length ? viewerIndex : 0
                }
                getItemLayout={(_data, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                renderItem={({ item }) => {
                  const imgUrl = typeof item === "object" ? item?.url : item
                  return (
                    <View
                      style={{ width: screenWidth, justifyContent: "center", alignItems: "center" }}
                    >
                      <Image
                        source={{ uri: imgUrl }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="contain"
                      />
                    </View>
                  )
                }}
              />
            )}
          </View>
        </Modal>
      </Screen>
    )
  },
)

export default ListingDetailsScreen
