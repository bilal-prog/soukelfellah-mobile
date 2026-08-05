import React, { FC, useState, memo, useCallback, useMemo, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { ListingImageManager } from "@/components/ListingImageManager"
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
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { s } from "@/utils/scaling"

interface AddListingScreenProps extends MainTabScreenProps<"Add"> {}

export const AddListingScreen: FC<AddListingScreenProps> = memo(function AddListingScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { navigation } = props
  const queryClient = useQueryClient()

  const { isAuthenticated, userLocation } = useAuth()

  const [step, setStep] = useState(1) // Step 1: Category, Step 2: Details & Media
  const [selectedCat, setSelectedCat] = useState<"PRODUCT" | "EQUIPMENT" | null>(null)

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [address, setAddress] = useState(userLocation?.address || "")
  const [imageItems, setImageItems] = useState<{ _id: string; url: string }[]>([])
  const [uploadingCount, setUploadingCount] = useState(0)

  const [titleError, setTitleError] = useState("")
  const [priceError, setPriceError] = useState("")
  const [quantityError, setQuantityError] = useState("")
  const [addressError, setAddressError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")

  const [model, setModel] = useState("")
  const [hours, setHours] = useState("")

  const [listingDirection, setListingDirection] = useState<"SELL" | "BUY">("SELL")
  const [purpose, setPurpose] = useState<"SELL" | "RENT">("SELL")
  const [priceType, setPriceType] = useState<"FIXED" | "NEGOTIABLE" | "CONTACT">("FIXED")
  const [condition, setCondition] = useState<"NEW" | "USED" | undefined>(undefined)

  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [selectedProductType, setSelectedProductType] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  const [categoryError, setCategoryError] = useState("")
  const [productTypeError, setProductTypeError] = useState("")
  const [unitError, setUnitError] = useState("")

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false)
  const [isProductTypeModalVisible, setIsProductTypeModalVisible] = useState(false)
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false)

  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedProvince, setSelectedProvince] = useState<any>(null)
  const [selectedCommune, setSelectedCommune] = useState<any>(null)

  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false)
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)
  const [isCommuneModalVisible, setIsCommuneModalVisible] = useState(false)

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
  const { data: dbCommunes, isFetching: isFetchingCommunes } = useLocationsQuery(
    selectedProvince ? { type: "commune", parentId: selectedProvince._id } : undefined,
    { enabled: !!selectedProvince },
  )

  // Auto-prefill location fields from authenticated user's location profile
  useEffect(() => {
    if (userLocation?.address && !address) {
      setAddress(userLocation.address)
    }
  }, [userLocation?.address])

  useEffect(() => {
    if (userLocation?.region && dbRegions && !selectedRegion) {
      const matchReg = dbRegions.find(
        (r: any) => r.name?.toLowerCase().trim() === userLocation.region?.toLowerCase().trim(),
      )
      if (matchReg) {
        setSelectedRegion(matchReg)
      }
    }
  }, [userLocation?.region, dbRegions, selectedRegion])

  useEffect(() => {
    if (userLocation?.province && dbProvinces && !selectedProvince) {
      const matchProv = dbProvinces.find(
        (p: any) => p.name?.toLowerCase().trim() === userLocation.province?.toLowerCase().trim(),
      )
      if (matchProv) {
        setSelectedProvince(matchProv)
      }
    }
  }, [userLocation?.province, dbProvinces, selectedProvince])

  useEffect(() => {
    if (userLocation?.commune && dbCommunes && !selectedCommune) {
      const matchComm = dbCommunes.find(
        (c: any) => c.name?.toLowerCase().trim() === userLocation.commune?.toLowerCase().trim(),
      )
      if (matchComm) {
        setSelectedCommune(matchComm)
      }
    }
  }, [userLocation?.commune, dbCommunes, selectedCommune])

  const productCategories = useMemo(() => {
    return (
      categories?.filter((c) => {
        const slug = c.slug?.toLowerCase() || ""
        const name = c.name?.toLowerCase() || ""
        const isEquip =
          slug.includes("equip") ||
          slug.includes("mach") ||
          slug.includes("معدات") ||
          name.includes("معدات") ||
          name.includes("equip") ||
          name.includes("mach")
        return !isEquip
      }) || []
    )
  }, [categories])

  const filteredProductTypes = useMemo(() => {
    if (selectedCat === "EQUIPMENT") {
      const equipCat = categories?.find((c) => {
        const slug = c.slug?.toLowerCase() || ""
        const name = c.name?.toLowerCase() || ""
        return (
          slug.includes("equip") ||
          slug.includes("mach") ||
          slug.includes("معدات") ||
          name.includes("معدات") ||
          name.includes("equip") ||
          name.includes("mach")
        )
      })

      const targetCatId = selectedCategory?._id || equipCat?._id

      if (!targetCatId) return productTypes || []

      return (
        productTypes?.filter((p) => {
          const pCatId =
            typeof p.categoryId === "object" && p.categoryId !== null
              ? (p.categoryId as any)._id
              : p.categoryId
          return pCatId === targetCatId
        }) || []
      )
    }

    if (!selectedCategory) return []
    return (
      productTypes?.filter((p) => {
        const pCatId =
          typeof p.categoryId === "object" && p.categoryId !== null
            ? (p.categoryId as any)._id
            : p.categoryId
        return pCatId === selectedCategory?._id
      }) || []
    )
  }, [productTypes, categories, selectedCategory, selectedCat])

  const mappedAllowedUnits = useMemo(() => {
    if (!selectedProductType) return []
    const allowed = selectedProductType.allowedUnits || []
    return allowed
      .map((u: any) => {
        if (typeof u === "object" && u !== null) return u
        return units?.find((unitItem: any) => unitItem._id === u)
      })
      .filter(Boolean)
  }, [selectedProductType, units])

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
      // Auto-resolve Category and Unit for Equipment
      const equipCat = categories?.find((c) => {
        const slug = c.slug?.toLowerCase() || ""
        const name = c.name?.toLowerCase() || ""
        return (
          slug.includes("equip") ||
          slug.includes("mach") ||
          slug.includes("معدات") ||
          name.includes("معدات") ||
          name.includes("equip") ||
          name.includes("mach")
        )
      })
      if (equipCat) {
        setSelectedCategory(equipCat)
      }
      const pieceUnit = units?.find(
        (u) =>
          u.name.toLowerCase().includes("piece") ||
          u.name.toLowerCase().includes("حبة") ||
          u.name.toLowerCase().includes("راس"),
      )
      if (pieceUnit) {
        setSelectedUnit(pieceUnit)
      }
      setSelectedProductType(null) // Let the user select the equipment type (Tractor, Pump, Plow)
    } else {
      setCondition(undefined)
      setPurpose("SELL")
      setSelectedCategory(null)
      setSelectedProductType(null)
      setSelectedUnit(null)
    }
    setCategoryError("")
    setProductTypeError("")
    setUnitError("")
    setStep(2)
  }

  const handleAddPhotos = useCallback(
    async (uris: string[]) => {
      setUploadingCount(uris.length)
      for (const uri of uris) {
        const filename = uri.split("/").pop() || "upload.jpg"
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : `image/jpeg`

        try {
          const fileData = await uploadImageMutation.mutateAsync({
            fileUri: uri,
            fileName: filename,
            mimeType: type,
          })
          if (fileData) {
            setImageItems((prev) => [...prev, { _id: fileData._id, url: fileData.url }])
          }
        } catch (err: any) {
          Alert.alert(
            translate("addListing:uploadErrorTitle"),
            err?.message || translate("addListing:uploadErrorMsg"),
          )
        } finally {
          setUploadingCount((c) => Math.max(0, c - 1))
        }
      }
    },
    [uploadImageMutation],
  )

  const handleRemovePhoto = useCallback((index: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleReorderPhotos = useCallback((newUrls: string[]) => {
    setImageItems((prev) => {
      const map = new Map(prev.map((item) => [item.url, item]))
      return newUrls.map((url) => map.get(url)).filter(Boolean) as { _id: string; url: string }[]
    })
  }, [])

  const handleSetPrincipalPhoto = useCallback((index: number) => {
    setImageItems((prev) => {
      if (index <= 0 || index >= prev.length) return prev
      const selected = prev[index]
      const rest = prev.filter((_, i) => i !== index)
      return [selected, ...rest]
    })
  }, [])

  const handlePublish = useCallback(() => {
    setTitleError("")
    setPriceError("")
    setQuantityError("")
    setAddressError("")
    setDescriptionError("")
    setCategoryError("")
    setProductTypeError("")
    setUnitError("")

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
    if (selectedCat === "PRODUCT" && !selectedCategory) {
      setCategoryError(translate("addListing:categoryRequired"))
      isValid = false
    }
    if (!selectedProductType) {
      setProductTypeError(translate("addListing:productTypeRequired"))
      isValid = false
    }
    if (selectedCat === "PRODUCT" && !selectedUnit) {
      setUnitError(translate("addListing:unitRequired"))
      isValid = false
    }

    if (!isValid) return

    const equipCat = categories?.find((c) => {
      const slug = c.slug?.toLowerCase() || ""
      const name = c.name?.toLowerCase() || ""
      return (
        slug.includes("equip") ||
        slug.includes("mach") ||
        slug.includes("معدات") ||
        name.includes("معدات") ||
        name.includes("equip") ||
        name.includes("mach")
      )
    })

    const categoryId =
      selectedCategory?._id ||
      (typeof selectedProductType?.categoryId === "object"
        ? (selectedProductType?.categoryId as any)?._id
        : selectedProductType?.categoryId) ||
      equipCat?._id

    const productTypeId = selectedProductType?._id
    const unitId = selectedUnit?._id

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
      images: imageItems.map((item) => item._id),
      location: {
        address,
        region: selectedRegion?.name || undefined,
        province: selectedProvince?.name || undefined,
        commune: selectedCommune?.name || undefined,
        coordinates: selectedProvince?.coordinates || undefined,
      },
      modelYear: selectedCat === "EQUIPMENT" ? model : undefined,
      hours: selectedCat === "EQUIPMENT" ? hours : undefined,
    }

    createListingMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.resetQueries({ queryKey: ["listings"] })
        Alert.alert(translate("addListing:successTitle"), translate("addListing:successMsg"), [
          {
            text: translate("addListing:successOk"),
            onPress: () => {
              setTitle("")
              setDescription("")
              setPrice("")
              setQuantity("")
              setAddress("")
              setImageItems([])
              setSelectedRegion(null)
              setSelectedProvince(null)
              setModel("")
              setHours("")
              setListingDirection("SELL")
              setPurpose("SELL")
              setPriceType("FIXED")
              setCondition(undefined)
              setSelectedCategory(null)
              setSelectedProductType(null)
              setSelectedUnit(null)
              setCategoryError("")
              setProductTypeError("")
              setUnitError("")
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
    imageItems,
    selectedCat,
    selectedRegion,
    selectedProvince,
    createListingMutation,
    navigation,
    priceType,
    condition,
    purpose,
    listingDirection,
    selectedCategory,
    selectedProductType,
    selectedUnit,
  ])

  const renderLocationIcon = useCallback(
    (p: any) => (
      <Ionicons
        name="location-outline"
        size={s(20)}
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
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={s(26)}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text tx="addListing:title" style={styles.headerTitle} size="lg" preset="bold" />
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
                  <Ionicons name="leaf-outline" size={s(32)} color={colors.palette.primary} />
                </View>
                <Text
                  tx="addListing:produceCategory"
                  size="xs"
                  preset="bold"
                  style={styles.categoryText}
                />
              </TouchableOpacity>

              {/* Machinery/Equipment button */}
              <TouchableOpacity
                onPress={() => selectCategory("EQUIPMENT")}
                style={styles.categoryBtn}
              >
                <View style={[styles.categoryIconCircle, styles.categoryIconEquipment]}>
                  <Ionicons
                    name="construct-outline"
                    size={s(32)}
                    color={colors.palette.secondary}
                  />
                </View>
                <Text
                  tx="addListing:equipmentCategory"
                  size="xs"
                  preset="bold"
                  style={styles.categoryText}
                />
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

              <ListingImageManager
                images={imageItems.map((item) => item.url)}
                onAddPhotos={handleAddPhotos}
                onRemovePhoto={handleRemovePhoto}
                onReorderPhotos={handleReorderPhotos}
                onSetPrincipalPhoto={handleSetPrincipalPhoto}
                maxPhotos={5}
                isUploading={uploadingCount > 0}
                uploadingCount={uploadingCount}
              />
            </View>

            {/* General Fields Form */}
            <View style={styles.formGroup}>
              {/* Category Selector (only for PRODUCT listings) */}
              {selectedCat === "PRODUCT" && (
                <View style={styles.inputField}>
                  <Text tx="addListing:categoryRequired" size="xxs" style={styles.selectLabel} />
                  <TouchableOpacity
                    onPress={() => setIsCategoryModalVisible(true)}
                    style={styles.selectTrigger}
                  >
                    <View style={styles.selectContent}>
                      <Text
                        text={
                          selectedCategory
                            ? selectedCategory.name
                            : translate("addListing:selectCategoryPlaceholder")
                        }
                        style={styles.selectValueText}
                      />
                      <Ionicons
                        name="chevron-down"
                        size={s(20)}
                        color={colors.palette.onSurfaceVariant}
                      />
                    </View>
                  </TouchableOpacity>
                  {categoryError ? (
                    <Text
                      text={categoryError}
                      size="xxs"
                      style={{ color: colors.palette.error, marginTop: 4 }}
                    />
                  ) : null}
                </View>
              )}

              {/* Product Type Selector */}
              <View style={styles.inputField}>
                <Text tx="addListing:productTypeRequired" size="xxs" style={styles.selectLabel} />
                <TouchableOpacity
                  onPress={() => {
                    if (selectedCat === "PRODUCT" && !selectedCategory) {
                      Alert.alert(
                        translate("addListing:missingInfoTitle"),
                        translate("addListing:selectCategoryPlaceholder"),
                      )
                      return
                    }
                    setIsProductTypeModalVisible(true)
                  }}
                  style={styles.selectTrigger}
                >
                  <View style={styles.selectContent}>
                    <Text
                      text={
                        selectedProductType
                          ? selectedProductType.name
                          : translate("addListing:selectProductTypePlaceholder")
                      }
                      style={styles.selectValueText}
                    />
                    <Ionicons
                      name="chevron-down"
                      size={s(20)}
                      color={colors.palette.onSurfaceVariant}
                    />
                  </View>
                </TouchableOpacity>
                {productTypeError ? (
                  <Text
                    text={productTypeError}
                    size="xxs"
                    style={{ color: colors.palette.error, marginTop: 4 }}
                  />
                ) : null}
              </View>

              {/* Unit Selector (only for PRODUCT listings) */}
              {selectedCat === "PRODUCT" && (
                <View style={styles.inputField}>
                  <Text tx="addListing:unitRequired" size="xxs" style={styles.selectLabel} />
                  <TouchableOpacity
                    onPress={() => {
                      if (!selectedProductType) {
                        Alert.alert(
                          translate("addListing:missingInfoTitle"),
                          translate("addListing:selectProductTypePlaceholder"),
                        )
                        return
                      }
                      setIsUnitModalVisible(true)
                    }}
                    style={styles.selectTrigger}
                  >
                    <View style={styles.selectContent}>
                      <Text
                        text={
                          selectedUnit
                            ? selectedUnit.name
                            : translate("addListing:selectUnitPlaceholder")
                        }
                        style={styles.selectValueText}
                      />
                      <Ionicons
                        name="chevron-down"
                        size={s(20)}
                        color={colors.palette.onSurfaceVariant}
                      />
                    </View>
                  </TouchableOpacity>
                  {unitError ? (
                    <Text
                      text={unitError}
                      size="xxs"
                      style={{ color: colors.palette.error, marginTop: 4 }}
                    />
                  ) : null}
                </View>
              )}

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
                <View style={styles.inputWrapperHalf}>
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
                  <Ionicons
                    name="chevron-down"
                    size={s(20)}
                    color={colors.palette.onSurfaceVariant}
                  />
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
                  <Ionicons
                    name="chevron-down"
                    size={s(20)}
                    color={colors.palette.onSurfaceVariant}
                  />
                </View>
              </TouchableOpacity>

              {/* Commune Selector (Optional) */}
              <TouchableOpacity
                onPress={() => {
                  if (!selectedProvince) {
                    Alert.alert(
                      translate("addListing:communeWarningTitle"),
                      translate("addListing:communeWarningMsg"),
                    )
                    return
                  }
                  setIsCommuneModalVisible(true)
                }}
                style={[styles.selectTrigger, { marginTop: 12 }]}
              >
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:communeLabel")}
                </Text>
                <View style={styles.selectContent}>
                  <Text
                    text={
                      selectedCommune
                        ? selectedCommune.name
                        : translate("addListing:selectCommunePlaceholder")
                    }
                    style={styles.selectValueText}
                  />
                  <Ionicons
                    name="chevron-down"
                    size={s(20)}
                    color={colors.palette.onSurfaceVariant}
                  />
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
                    <Text tx="addListing:submit" size="md" style={styles.submitBtnText} />
                    <Ionicons
                      name={isRTL ? "arrow-back" : "arrow-forward"}
                      size={s(20)}
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
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text tx="addListing:selectRegionPlaceholder" preset="bold" size="sm" />
              <TouchableOpacity onPress={() => setIsRegionModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
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
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedRegion(item)
                      setSelectedProvince(null)
                      setSelectedCommune(null)
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
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectProvincePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsProvinceModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
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
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedProvince(item)
                      setSelectedCommune(null)
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

      {/* Commune Selection Modal (Optional) */}
      <Modal visible={isCommuneModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectCommunePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsCommuneModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingCommunes ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={[{ _id: "none", name: translate("common:none") }, ...(dbCommunes || [])]}
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      if (item._id === "none") {
                        setSelectedCommune(null)
                      } else {
                        setSelectedCommune(item)
                      }
                      setIsCommuneModalVisible(false)
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

      {/* Category Selection Modal */}
      <Modal visible={isCategoryModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectCategoryPlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={productCategories}
              keyExtractor={(item: any) => item?._id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(item)
                    setSelectedProductType(null)
                    setSelectedUnit(null)
                    setIsCategoryModalVisible(false)
                    setCategoryError("")
                  }}
                >
                  <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Product Type Selection Modal */}
      <Modal visible={isProductTypeModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectProductTypePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsProductTypeModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredProductTypes}
              keyExtractor={(item: any) => item?._id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedProductType(item)
                    // If it is EQUIPMENT, auto-set the unit to piece
                    if (selectedCat === "EQUIPMENT") {
                      const pieceUnit = units?.find(
                        (u) =>
                          u.name.toLowerCase() === "piece" || u.name.toLowerCase() === "pieces",
                      )
                      if (pieceUnit) {
                        setSelectedUnit(pieceUnit)
                      }
                    } else {
                      // If it's a product, auto-set the unit to the first allowed unit
                      const firstUnit =
                        typeof item.allowedUnits?.[0] === "object"
                          ? item.allowedUnits[0]
                          : units?.find((u) => u._id === item.allowedUnits?.[0])
                      setSelectedUnit(firstUnit || null)
                    }
                    setIsProductTypeModalVisible(false)
                    setProductTypeError("")
                    setUnitError("")
                  }}
                >
                  <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Unit Selection Modal */}
      <Modal visible={isUnitModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectUnitPlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsUnitModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mappedAllowedUnits}
              keyExtractor={(item: any) => item?._id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedUnit(item)
                    setIsUnitModalVisible(false)
                    setUnitError("")
                  }}
                >
                  <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

export default AddListingScreen
