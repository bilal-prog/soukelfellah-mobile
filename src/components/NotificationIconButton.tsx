import React, { FC, useCallback } from "react"
import { TouchableOpacity, View, ViewStyle, TextStyle, StyleProp } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { AppStackParamList } from "@/navigation/navigationTypes"
import { useUnreadNotificationsCountQuery } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"
import { fontSizes } from "@/theme/fontSizes"
import { s, vs } from "@/utils/scaling"

interface NotificationIconButtonProps {
  color?: string
  size?: number
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

export const NotificationIconButton: FC<NotificationIconButtonProps> = ({
  color,
  size = 26,
  style,
  onPress,
}) => {
  const { theme } = useAppTheme()
  const { isAuthenticated } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  const iconColor = color || theme.colors.palette.primary

  const { data: unreadCount, refetch } = useUnreadNotificationsCountQuery({
    enabled: isAuthenticated,
  })

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        refetch()
      }
    }, [isAuthenticated, refetch]),
  )

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress()
    } else {
      navigation.navigate("Notifications")
    }
  }, [onPress, navigation])

  const formattedCount =
    typeof unreadCount === "number" && unreadCount > 0
      ? unreadCount > 99
        ? "99+"
        : `+${unreadCount}`
      : null

  return (
    <TouchableOpacity
      style={[$container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Notifications"
    >
      <Ionicons name="notifications-outline" size={size} color={iconColor} />
      {formattedCount && (
        <View style={[$badge, { backgroundColor: theme.colors.palette.error }]}>
          <Text text={formattedCount} style={$badgeText} />
        </View>
      )}
    </TouchableOpacity>
  )
}

const $container: ViewStyle = {
  padding: s(4),
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
}

const $badge: ViewStyle = {
  position: "absolute",
  top: vs(-2),
  right: -s(4),
  minWidth: s(18),
  height: vs(18),
  borderRadius: s(9),
  paddingHorizontal: s(4),
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1.5,
  borderColor: "#FFFFFF",
}

const $badgeText: TextStyle = {
  color: "#FFFFFF",
  fontSize: fontSizes.fs10,
  fontWeight: "bold",
  lineHeight: vs(12),
  textAlign: "center",
}
