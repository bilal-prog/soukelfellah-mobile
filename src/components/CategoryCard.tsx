import { memo } from "react"
import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"

import { Text } from "./Text"

export interface CategoryCardProps {
  label: string
  icon: string // Emoji or material icon name
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
    ? { borderColor: colors.palette.primary, borderWidth: 2 }
    : { borderColor: "transparent", borderWidth: 2 }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[$container, borderStyle]}>
      <View style={[$circle, { backgroundColor: bg }]}>
        <Text text={icon} style={$emoji} />
      </View>
      <Text text={label} size="xxs" preset="bold" numberOfLines={1} style={$label} />
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  alignItems: "center",
  marginHorizontal: 6,
  borderRadius: 16,
  padding: 6,
}

const $circle: ViewStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 1,
}

const $emoji: TextStyle = {
  fontSize: 28,
  lineHeight: 28,
}

const $label: TextStyle = {
  textAlign: "center",
  color: "#191c1d",
}
