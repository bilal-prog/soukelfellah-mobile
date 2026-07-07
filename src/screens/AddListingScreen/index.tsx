import React, { FC, useState, memo, useCallback } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import {
  useCreateListingMutation,
  useCategoriesQuery,
  useProductTypesQuery,
  useMeasurementUnitsQuery,
  useUploadListingImageMutation,
  useLocationsQuery,
} from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"

interface AddListingScreenProps extends MainTabScreenProps<"Add"> {}

export const AddListingScreen: FC<AddListingScreenProps> = memo(function AddListingScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props

  const { isAuthenticated } = useAuth()

  const [step, setStep] = useState(1) // Step 1: Category, Step 2: Details & Media
  const [selectedCat, setSelectedCat] = useState<"PRODUCT" | "EQUIPMENT" | null>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [address, setAddress] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageIds, setImageIds] = useState<string[]>([])

  const [titleError, setTitleError] = useState("")
  const [priceError, setPriceError] = useState("")
  const [quantityError, setQuantityError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")

  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedProvince, setSelectedProvince] = useState<any>(null)
  const [model, setModel] = useState("")
  const [hours, setHours] = useState("")

  const [listingDirection, setListingDirection] = useState<"SELL" | "BUY">("SELL")
  const [purpose, setPurpose] = useState<"SELL" | "RENT">("SELL")
  const [priceType, setPriceType] = useState<"FIXED" | "NEGOTIABLE" | "CONTACT">("FIXED")
  const [condition, setCondition] = useState<"NEW" | "USED" | undefined>(undefined)

  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false)
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)

  const createListingMutation = useCreateListingMutation()
  const uploadImageMutation = useUploadListingImageMutation()
  const isLoading = createListingMutation.isPending

  // Background database queries to fetch dynamic IDs for validation compliance
  const { data: categories } = useCategoriesQuery()
  const { data: productTypes } = useProductTypesQuery()
  const { data: units } = useMeasurementUnitsQuery()

  const { data: dbRegions, isFetching: isFetchingRegions } = useLocationsQuery({ type: "region" })
  const { data: dbProvinces, isFetching: isFetchingProvinces } = useLocationsQuery(
    selectedRegion ? { type: "province", parentId: selectedRegion._id } : undefined,
    { enabled: !!selectedRegion },
  )

  const handleGoBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      navigation.goBack()
    }
  }, [step, navigation])

  const selectCategory = (type: "PRODUCT" | "EQUIPMENT") => {
    setSelectedCat(type)
    if (type === "EQUIPMENT") {
      setCondition("USED")
    } else {
      setCondition(undefined)
      setPurpose("SELL")
    }
    setStep(2)
  }

  const handlePickImage = async () => {
    if (images.length >= 5) {
      Alert.alert(
        translate("addListing:photoLimitErrorTitle"),
        translate("addListing:photoLimitErrorMsg"),
      )
      return
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert(
        translate("addListing:permissionDeniedTitle"),
        translate("addListing:permissionDeniedMsg"),
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (result.canceled || !result.assets?.[0]) return

    const localUri = result.assets[0].uri
    const filename = localUri.split("/").pop() || "upload.jpg"
    const match = /\.(\w+)$/.exec(filename)
    const type = match ? `image/${match[1]}` : `image/jpeg`

    uploadImageMutation.mutate(
      { fileUri: localUri, fileName: filename, mimeType: type },
      {
        onSuccess: (fileData) => {
          if (fileData) {
            setImages((prev) => [...prev, fileData.url])
            setImageIds((prev) => [...prev, fileData._id])
          }
        },
        onError: (err: any) => {
          Alert.alert(
            translate("addListing:uploadErrorTitle"),
            err.message || translate("addListing:uploadErrorMsg"),
          )
        },
      },
    )
  }

  const removePhoto = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageIds(imageIds.filter((_, i) => i !== index))
  }

  const handlePublish = useCallback(() => {
    setTitleError("")
    setPriceError("")
    setQuantityError("")
    setAddressError("")
    setDescriptionError("")

    const isPriceRequired =
      (priceType === "FIXED" || priceType === "NEGOTIABLE") && listingDirection === "SELL"

    let isValid = true
    if (!title) {
      setTitleError(translate("addListing:titleRequired"))
      isValid = false
    }
    if (isPriceRequired && !price) {
      setPriceError(translate("addListing:priceRequired"))
      isValid = false
    }
    if (!quantity) {
      setQuantityError(translate("addListing:quantityRequired"))
      isValid = false
    }
    if (!address) {
      setAddressError(translate("addListing:addressRequired"))
      isValid = false
    }
    if (description.trim() && description.trim().length < 10) {
      setDescriptionError(translate("addListing:descriptionMinLength"))
      isValid = false
    }

    if (!isValid) return

    // Resolve matching categoryId, productTypeId, and unitId from active database seeds
    const selectedCategory =
      categories?.find((c) => {
        const isEquip =
          c.slug.toLowerCase().includes("equip") || c.slug.toLowerCase().includes("mach")
        return selectedCat === "EQUIPMENT" ? isEquip : !isEquip
      }) || categories?.[0]

    const categoryId = selectedCategory?._id || "64b0c1230000000000000001"

    const validProductType =
      productTypes?.find((p) => p.categoryId === categoryId) || productTypes?.[0]

    const productTypeId = validProductType?._id || "64b0d4560000000000000002"

    const unitId =
      typeof validProductType?.allowedUnits?.[0] === "object"
        ? validProductType.allowedUnits[0]?._id
        : validProductType?.allowedUnits?.[0] || units?.[0]?._id || "64b0b7890000000000000003"

    const payload = {
      title,
      description: description || translate("addListing:noDescription"),
      categoryId,
      productTypeId,
      listingType: selectedCat || "PRODUCT",
      quantity: parseFloat(quantity),
      unitId,
      price: priceType !== "CONTACT" && price ? parseFloat(price) : undefined,
      priceType,
      condition: selectedCat === "EQUIPMENT" ? condition : undefined,
      purpose,
      listingDirection,
      images: imageIds,
      location: {
        address,
        region: selectedRegion?.name || undefined,
        province: selectedProvince?.name || undefined,
        coordinates: selectedProvince?.coordinates || undefined,
      },
      modelYear: selectedCat === "EQUIPMENT" ? model : undefined,
      hours: selectedCat === "EQUIPMENT" ? hours : undefined,
    }

    createListingMutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert(translate("addListing:successTitle"), translate("addListing:successMsg"), [
          {
            text: translate("addListing:successOk"),
            onPress: () => {
              setTitle("")
              setDescription("")
              setPrice("")
              setQuantity("")
              setAddress("")
              setImages([])
              setImageIds([])
              setSelectedRegion(null)
              setSelectedProvince(null)
              setModel("")
              setHours("")
              setListingDirection("SELL")
              setPurpose("SELL")
              setPriceType("FIXED")
              setCondition(undefined)
              setStep(1)
              navigation.navigate("Home")
            },
          },
        ])
      },
      onError: (error: any) => {
        const errMsg = error.message || translate("addListing:publishErrorDefault")
        Alert.alert(translate("addListing:publishErrorTitle"), errMsg)
      },
    })
  }, [
    title,
    description,
    price,
    quantity,
    address,
    imageIds,
    selectedCat,
    selectedRegion,
    selectedProvince,
    categories,
    productTypes,
    units,
    createListingMutation,
    navigation,
    priceType,
    condition,
    purpose,
    listingDirection,
  ])

  const renderLocationIcon = useCallback(
    (p: any) => (
      <Ionicons
        name="location-outline"
        size={20}
        color={colors.palette.onSurfaceVariant}
        style={p.style}
      />
    ),
    [colors],
  )

  if (!isAuthenticated) {
    return (
      <GuestPlaceholder
        icon="add-circle-outline"
        titleTx="guest:addListingTitle"
        descriptionTx="guest:addListingDesc"
      />
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={26} color={colors.text} />
          </TouchableOpacity>
          <Text tx="addListing:title" style={styles.headerTitle} preset="bold" />
        </View>

        {/* Dynamic step dot indicators */}
        <View style={styles.stepIndicators}>
          <View
            style={[styles.stepDot, step >= 1 ? styles.stepDotActive : styles.stepDotInactive]}
          />
          <View
            style={[styles.stepDot, step >= 2 ? styles.stepDotActive : styles.stepDotInactive]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.section}>
            <Text tx="addListing:step1Title" preset="subheading" style={styles.sectionTitle} />

            <View style={styles.categoryGrid}>
              {/* Agricultural produce button */}
              <TouchableOpacity
                onPress={() => selectCategory("PRODUCT")}
                style={styles.categoryBtn}
              >
                <View style={[styles.categoryIconCircle, styles.categoryIconProduce]}>
                  <Ionicons name="leaf-outline" size={32} color={colors.palette.primary} />
                </View>
                <Text tx="addListing:produceCategory" size="xs" preset="bold" />
              </TouchableOpacity>

              {/* Machinery/Equipment button */}
              <TouchableOpacity
                onPress={() => selectCategory("EQUIPMENT")}
                style={styles.categoryBtn}
              >
                <View style={[styles.categoryIconCircle, styles.categoryIconEquipment]}>
                  <Ionicons name="construct-outline" size={32} color={colors.palette.secondary} />
                </View>
                <Text tx="addListing:equipmentCategory" size="xs" preset="bold" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            {/* Photos Upload Area */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadHeader}>
                <Text tx="addListing:step2Title" preset="subheading" style={styles.sectionTitle} />
                <Text tx="addListing:photoLimit" size="xxs" style={styles.photoLimitText} />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePickImage}
                style={styles.uploadBox}
                disabled={uploadImageMutation.isPending}
              >
                {uploadImageMutation.isPending ? (
                  <ActivityIndicator color={colors.palette.primary} size="large" />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={40} color={colors.palette.primary} />
                    <Text
                      tx="addListing:uploadPlaceholder"
                      size="xs"
                      style={styles.photoLimitText}
                    />
                  </>
                )}
              </TouchableOpacity>

              {images.length > 0 && (
                <View style={styles.previewGrid}>
                  {images.map((imgUrl, index) => (
                    <View key={index} style={styles.previewWrapper}>
                      <Image source={{ uri: imgUrl }} style={styles.previewImage} />
                      <TouchableOpacity
                        onPress={() => removePhoto(index)}
                        style={styles.deletePreviewBtn}
                      >
                        <Ionicons name="close" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* General Fields Form */}
            <View style={styles.formGroup}>
              <View style={styles.inputField}>
                <Text tx="addListing:listingDirectionLabel" size="xxs" style={styles.selectLabel} />
                <View style={styles.segmentRow}>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      listingDirection === "SELL" && styles.segmentButtonActive,
                    ]}
                    onPress={() => setListingDirection("SELL")}
                  >
                    <Text
                      tx="addListing:directionSell"
                      size="xs"
                      style={[
                        styles.segmentText,
                        listingDirection === "SELL" && styles.segmentTextActive,
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      listingDirection === "BUY" && styles.segmentButtonActive,
                    ]}
                    onPress={() => setListingDirection("BUY")}
                  >
                    <Text
                      tx="addListing:directionBuy"
                      size="xs"
                      style={[
                        styles.segmentText,
                        listingDirection === "BUY" && styles.segmentTextActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {selectedCat === "EQUIPMENT" && (
                <View style={styles.inputField}>
                  <Text tx="addListing:listingPurposeLabel" size="xxs" style={styles.selectLabel} />
                  <View style={styles.segmentRow}>
                    <TouchableOpacity
                      style={[
                        styles.segmentButton,
                        purpose === "SELL" && styles.segmentButtonActive,
                      ]}
                      onPress={() => setPurpose("SELL")}
                    >
                      <Text
                        tx="addListing:purposeSell"
                        size="xs"
                        style={[styles.segmentText, purpose === "SELL" && styles.segmentTextActive]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.segmentButton,
                        purpose === "RENT" && styles.segmentButtonActive,
                      ]}
                      onPress={() => setPurpose("RENT")}
                    >
                      <Text
                        tx="addListing:purposeRent"
                        size="xs"
                        style={[styles.segmentText, purpose === "RENT" && styles.segmentTextActive]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TextField
                value={title}
                onChangeText={(val) => {
                  setTitle(val)
                  if (titleError) setTitleError("")
                }}
                placeholder={translate("addListing:listingTitlePlaceholder")}
                labelTx="addListing:listingTitleLabel"
                helper={titleError || translate("addListing:listingTitleHelper")}
                status={titleError ? "error" : undefined}
                containerStyle={styles.inputField}
              />

              <TextField
                value={description}
                onChangeText={(val) => {
                  setDescription(val)
                  if (descriptionError) setDescriptionError("")
                }}
                placeholder={translate("addListing:descriptionPlaceholder")}
                label={translate("addListing:descriptionLabel")}
                helper={descriptionError}
                status={descriptionError ? "error" : undefined}
                multiline
                numberOfLines={3}
                containerStyle={styles.inputField}
              />

              <View style={styles.inputField}>
                <Text tx="addListing:priceTypeLabel" size="xxs" style={styles.selectLabel} />
                <View style={styles.segmentRow}>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceType === "FIXED" && styles.segmentButtonActive,
                    ]}
                    onPress={() => setPriceType("FIXED")}
                  >
                    <Text
                      tx="addListing:priceTypeFixed"
                      size="xs"
                      style={[
                        styles.segmentText,
                        priceType === "FIXED" && styles.segmentTextActive,
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceType === "NEGOTIABLE" && styles.segmentButtonActive,
                    ]}
                    onPress={() => setPriceType("NEGOTIABLE")}
                  >
                    <Text
                      tx="addListing:priceTypeNegotiable"
                      size="xs"
                      style={[
                        styles.segmentText,
                        priceType === "NEGOTIABLE" && styles.segmentTextActive,
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      priceType === "CONTACT" && styles.segmentButtonActive,
                    ]}
                    onPress={() => setPriceType("CONTACT")}
                  >
                    <Text
                      tx="addListing:priceTypeContact"
                      size="xs"
                      style={[
                        styles.segmentText,
                        priceType === "CONTACT" && styles.segmentTextActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.quantityPriceRow}>
                <View
                  style={
                    priceType === "CONTACT" ? styles.inputWrapperFull : styles.inputWrapperHalf
                  }
                >
                  <TextField
                    value={quantity}
                    onChangeText={(val) => {
                      setQuantity(val)
                      if (quantityError) setQuantityError("")
                    }}
                    placeholder="100"
                    keyboardType="numeric"
                    labelTx="addListing:quantityLabel"
                    helper={quantityError}
                    status={quantityError ? "error" : undefined}
                  />
                </View>
                {priceType !== "CONTACT" && (
                  <View style={styles.inputWrapperHalf}>
                    <TextField
                      value={price}
                      onChangeText={(val) => {
                        setPrice(val)
                        if (priceError) setPriceError("")
                      }}
                      placeholder="0.00"
                      keyboardType="numeric"
                      labelTx="addListing:priceLabel"
                      helper={priceError}
                      status={priceError ? "error" : undefined}
                    />
                  </View>
                )}
              </View>

              {selectedCat === "EQUIPMENT" && (
                <>
                  <View style={[styles.quantityPriceRow, { marginTop: 12 }]}>
                    <View style={styles.inputWrapperHalf}>
                      <TextField
                        value={model}
                        onChangeText={setModel}
                        placeholder={translate("addListing:modelPlaceholder")}
                        label={translate("addListing:modelLabel")}
                      />
                    </View>
                    <View style={styles.inputWrapperHalf}>
                      <TextField
                        value={hours}
                        onChangeText={setHours}
                        placeholder={translate("addListing:hoursPlaceholder")}
                        label={translate("addListing:hoursLabel")}
                      />
                    </View>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text tx="addListing:conditionLabel" size="xxs" style={styles.selectLabel} />
                    <View style={styles.segmentRow}>
                      <TouchableOpacity
                        style={[
                          styles.segmentButton,
                          condition === "NEW" && styles.segmentButtonActive,
                        ]}
                        onPress={() => setCondition("NEW")}
                      >
                        <Text
                          tx="addListing:conditionNew"
                          size="xs"
                          style={[
                            styles.segmentText,
                            condition === "NEW" && styles.segmentTextActive,
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segmentButton,
                          condition === "USED" && styles.segmentButtonActive,
                        ]}
                        onPress={() => setCondition("USED")}
                      >
                        <Text
                          tx="addListing:conditionUsed"
                          size="xs"
                          style={[
                            styles.segmentText,
                            condition === "USED" && styles.segmentTextActive,
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {/* Region Selector */}
              <TouchableOpacity
                onPress={() => setIsRegionModalVisible(true)}
                style={styles.selectTrigger}
              >
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:regionLabel")}
                </Text>
                <View style={styles.selectContent}>
                  <Text
                    text={
                      selectedRegion
                        ? selectedRegion.name
                        : translate("addListing:selectRegionPlaceholder")
                    }
                    style={styles.selectValueText}
                  />
                  <Ionicons name="chevron-down" size={20} color={colors.palette.onSurfaceVariant} />
                </View>
              </TouchableOpacity>

              {/* Province Selector */}
              <TouchableOpacity
                onPress={() => {
                  if (!selectedRegion) {
                    Alert.alert(
                      translate("addListing:regionWarningTitle"),
                      translate("addListing:regionWarningMsg"),
                    )
                    return
                  }
                  setIsProvinceModalVisible(true)
                }}
                style={[styles.selectTrigger, { marginTop: 12 }]}
              >
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:provinceLabel")}
                </Text>
                <View style={styles.selectContent}>
                  <Text
                    text={
                      selectedProvince
                        ? selectedProvince.name
                        : translate("addListing:selectProvincePlaceholder")
                    }
                    style={styles.selectValueText}
                  />
                  <Ionicons name="chevron-down" size={20} color={colors.palette.onSurfaceVariant} />
                </View>
              </TouchableOpacity>

              <TextField
                value={address}
                onChangeText={(val) => {
                  setAddress(val)
                  if (addressError) setAddressError("")
                }}
                placeholder={translate("addListing:addressPlaceholder")}
                labelTx="addListing:addressLabel"
                helper={addressError}
                status={addressError ? "error" : undefined}
                LeftAccessory={renderLocationIcon}
                containerStyle={styles.inputField}
              />

              {/* Publish CTA */}
              <Button
                preset="primary"
                style={styles.submitBtn}
                onPress={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={styles.submitBtnContent}>
                    <Text tx="addListing:submit" style={styles.submitBtnText} />
                    <Ionicons
                      name={isRTL ? "arrow-back" : "arrow-forward"}
                      size={20}
                      color="white"
                    />
                  </View>
                )}
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Region Selection Modal */}
      <Modal visible={isRegionModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text tx="addListing:selectRegionPlaceholder" preset="bold" size="sm" />
              <TouchableOpacity onPress={() => setIsRegionModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingRegions ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={dbRegions || []}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedRegion(item)
                      setSelectedProvince(null)
                      setIsRegionModalVisible(false)
                    }}
                  >
                    <Text text={item.name} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Province Selection Modal */}
      <Modal visible={isProvinceModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectProvincePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsProvinceModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingProvinces ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={dbProvinces || []}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedProvince(item)
                      setIsProvinceModalVisible(false)
                    }}
                  >
                    <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

export default AddListingScreen
