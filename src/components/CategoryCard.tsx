import { memo } from "react"
import { TouchableOpacity, View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"

import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

import { Text } from "./Text"

export interface CategoryCardProps {
  label: string
  icon: string | { _id: string; url: string } | undefined
  backgroundColor?: string
  onPress?: () => void
  selected?: boolean
}

export const CategoryCard = memo(function CategoryCard(props: CategoryCardProps) {
  const { label, icon, backgroundColor, onPress, selected } = props
  const { theme } = useAppTheme()
  const { colors } = theme

  const bg = backgroundColor || colors.palette.surfaceContainerLow
  const borderStyle = selected
    ? { backgroundColor: colors.palette.primary, padding: s(5) }
    : { backgroundColor: "transparent" }

  const textColor = selected ? "white" : "black"

  const isEmoji = (val: any) => {
    if (typeof val === "string") {
      return !val.includes("/") && !val.includes("http")
    }
    return false
  }

  const renderIcon = () => {
    if (!icon) return null
    if (isEmoji(icon)) {
      return <Text text={icon as string} style={$emoji} />
    }
    const uri = typeof icon === "object" ? icon.url : (icon as string)
    return <Image source={{ uri }} style={$image} />
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[$container, borderStyle]}>
      <View style={[$circle, { backgroundColor: bg }]}>{renderIcon()}</View>
      <Text
        text={label}
        size="xxs"
        preset="bold"
        numberOfLines={1}
        style={[$label, { color: textColor }]}
      />
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  alignItems: "center",
  marginHorizontal: s(6),
  borderRadius: s(5),
}

const $circle: ViewStyle = {
  width: s(60),
  height: vs(60),
  justifyContent: "center",
  alignItems: "center",
  marginBottom: vs(8),
  borderRadius: s(5),
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 1,
}

const $emoji: TextStyle = {
  fontSize: fontSizes.fs28,
  lineHeight: vs(28),
}

const $label: TextStyle = {
  textAlign: "center",
  lineHeight: vs(20),
  color: "#191c1d",
}

const $image: ImageStyle = {
  width: s(55),
  height: vs(55),
  resizeMode: "contain",
  borderRadius: s(5),
}
