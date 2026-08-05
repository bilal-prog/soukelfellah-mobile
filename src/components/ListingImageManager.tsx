import React, { FC, memo } from "react"
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { translate } from "@/localization/translate"
import { s, vs } from "@/utils/scaling"

export interface ListingImageManagerProps {
  images: string[]
  onAddPhotos: (uris: string[]) => void
  onRemovePhoto: (index: number) => void
  onReorderPhotos: (newImages: string[]) => void
  onSetPrincipalPhoto: (index: number) => void
  maxPhotos?: number
  isUploading?: boolean
  uploadingCount?: number
}

export const ListingImageManager: FC<ListingImageManagerProps> = memo(function ListingImageManager({
  images,
  onAddPhotos,
  onRemovePhoto,
  onReorderPhotos,
  onSetPrincipalPhoto,
  maxPhotos = 5,
  isUploading = false,
  uploadingCount = 0,
}) {
  const { theme } = useAppTheme()
  const { colors } = theme

  const remainingCount = maxPhotos - images.length

  const handleLaunchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert(
        translate("addListing:cameraPermissionDeniedTitle"),
        translate("addListing:cameraPermissionDeniedMsg"),
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (result.canceled || !result.assets?.[0]) return
    onAddPhotos([result.assets[0].uri])
  }

  const handleLaunchLibrary = async () => {
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
      allowsMultipleSelection: true,
      selectionLimit: remainingCount > 0 ? remainingCount : 1,
      quality: 0.8,
    })

    if (result.canceled || !result.assets || result.assets.length === 0) return
    const uris = result.assets.map((asset) => asset.uri).filter(Boolean)
    if (uris.length > 0) {
      onAddPhotos(uris)
    }
  }

  const handlePickImage = () => {
    if (images.length >= maxPhotos) {
      Alert.alert(
        translate("addListing:photoLimitErrorTitle"),
        translate("addListing:photoLimitErrorMsg"),
      )
      return
    }

    Alert.alert(
      translate("addListing:addPhotoSourceTitle"),
      translate("addListing:multiPhotoHint"),
      [
        {
          text: translate("addListing:cameraOption"),
          onPress: handleLaunchCamera,
        },
        {
          text: translate("addListing:galleryOption"),
          onPress: handleLaunchLibrary,
        },
        {
          text: translate("addListing:cancelOption"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    )
  }

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return
    const updated = [...images]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    onReorderPhotos(updated)
  }

  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return
    const updated = [...images]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    onReorderPhotos(updated)
  }

  return (
    <View style={$container}>
      {/* Upload Trigger Area */}
      <TouchableOpacity
        onPress={handlePickImage}
        disabled={isUploading || images.length >= maxPhotos}
        style={[
          $uploadBox,
          {
            borderColor: colors.palette.primary,
            backgroundColor: colors.palette.surfaceVariant || "#f5f5f5",
            opacity: images.length >= maxPhotos ? 0.6 : 1,
          },
        ]}
      >
        {isUploading ? (
          <View style={$uploadingState}>
            <ActivityIndicator size="large" color={colors.palette.primary} />
            <Text
              text={uploadingCount > 1 ? `${uploadingCount} ...` : "..."}
              size="xs"
              style={{ color: colors.text, marginTop: vs(6) }}
            />
          </View>
        ) : (
          <View style={$uploadContent}>
            <Ionicons name="camera-outline" size={s(36)} color={colors.palette.primary} />
            <Text
              tx="addListing:uploadPlaceholder"
              size="xs"
              preset="bold"
              style={{ color: colors.text, marginTop: vs(4) }}
            />
            <Text
              tx="addListing:multiPhotoHint"
              size="xxs"
              style={{
                color: colors.palette.onSurfaceVariant,
                marginTop: vs(2),
                textAlign: "center",
              }}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Selected Images Grid with Principal Badge and Controls */}
      {images.length > 0 && (
        <View style={$grid}>
          {images.map((imgUrl, index) => {
            const isPrincipal = index === 0

            return (
              <View
                key={`${imgUrl}-${index}`}
                style={[
                  $card,
                  {
                    borderColor: isPrincipal ? "#EAB308" : colors.palette.outlineVariant,
                    borderWidth: isPrincipal ? 2 : 1,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Image source={{ uri: imgUrl }} style={$cardImage} contentFit="cover" />

                {/* Principal Badge for Index 0 */}
                {isPrincipal ? (
                  <View style={$principalBadge}>
                    <Ionicons name="star" size={s(12)} color="#FFFFFF" />
                    <Text
                      tx="addListing:principalPhotoBadge"
                      size="xxxs"
                      preset="bold"
                      style={$principalBadgeText}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => onSetPrincipalPhoto(index)}
                    style={$setPrincipalBtn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="star-outline" size={s(12)} color="#FFFFFF" />
                    <Text tx="addListing:setAsPrincipal" size="xxxs" style={$setPrincipalText} />
                  </TouchableOpacity>
                )}

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => onRemovePhoto(index)}
                  style={$deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={s(14)} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Reordering Controls (Left / Right) */}
                <View style={$reorderBar}>
                  {index > 0 && (
                    <TouchableOpacity onPress={() => handleMoveLeft(index)} style={$arrowBtn}>
                      <Ionicons name="chevron-back" size={s(16)} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <View style={{ flex: 1 }} />
                  {index < images.length - 1 && (
                    <TouchableOpacity onPress={() => handleMoveRight(index)} style={$arrowBtn}>
                      <Ionicons name="chevron-forward" size={s(16)} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
})

const $container: ViewStyle = {
  marginVertical: vs(8),
}

const $uploadBox: ViewStyle = {
  borderWidth: 1.5,
  borderStyle: "dashed",
  borderRadius: 12,
  paddingVertical: vs(16),
  paddingHorizontal: s(12),
  alignItems: "center",
  justifyContent: "center",
}

const $uploadContent: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $uploadingState: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $grid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: s(10),
  marginTop: vs(12),
}

const $card: ViewStyle = {
  width: s(115),
  height: vs(135),
  borderRadius: 10,
  overflow: "hidden",
  position: "relative",
}

const $cardImage: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $principalBadge: ViewStyle = {
  position: "absolute",
  top: vs(6),
  left: s(6),
  backgroundColor: "#EAB308",
  borderRadius: 6,
  paddingHorizontal: s(6),
  paddingVertical: vs(3),
  flexDirection: "row",
  alignItems: "center",
  gap: s(4),
}

const $principalBadgeText: TextStyle = {
  color: "#FFFFFF",
}

const $setPrincipalBtn: ViewStyle = {
  position: "absolute",
  top: vs(6),
  left: s(6),
  backgroundColor: "rgba(0, 0, 0, 0.65)",
  borderRadius: 6,
  paddingHorizontal: s(6),
  paddingVertical: vs(3),
  flexDirection: "row",
  alignItems: "center",
  gap: s(4),
}

const $setPrincipalText: TextStyle = {
  color: "#FFFFFF",
}

const $deleteBtn: ViewStyle = {
  position: "absolute",
  top: vs(0),
  right: s(0),
  width: s(22),
  height: s(22),
  borderRadius: s(11),
  backgroundColor: "rgba(220, 38, 38, 0.85)",
  alignItems: "center",
  justifyContent: "center",
}

const $reorderBar: ViewStyle = {
  position: "absolute",
  bottom: vs(6),
  left: s(6),
  right: s(6),
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $arrowBtn: ViewStyle = {
  width: s(24),
  height: s(24),
  borderRadius: s(12),
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  alignItems: "center",
  justifyContent: "center",
}
