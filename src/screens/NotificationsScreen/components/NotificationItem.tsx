import React, { memo } from "react"
import { View, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { ApiNotification } from "@/services/api/modules/notifications"
import { formatRelativeTime } from "@/utils/formatDate"
import { $styles } from "../styles"
import { useAppTheme } from "@/theme/context"
import { s } from "@/utils/scaling"

interface NotificationItemProps {
  item: ApiNotification
  onPress: (item: ApiNotification) => void
  onLongPress: (id: string) => void
}

/**
 * Maps notification types to relevant Ionicons.
 */
const getIconForType = (type: string) => {
  switch (type) {
    case "view":
      return "eye"
    case "like":
      return "heart"
    case "marketing":
      return "pricetag"
    case "system":
    default:
      return "information-circle"
  }
}

export const NotificationItem = memo(function NotificationItem({
  item,
  onPress,
  onLongPress,
}: NotificationItemProps) {
  const isUnread = !item.isRead
  const imageUrl = item.metadata?.imageUrl || item.metadata?.image || (item as any).imageUrl

  const handlePress = () => onPress(item)
  const handleLongPress = () => onLongPress(item?._id)

  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)

  return (
    <TouchableOpacity
      style={[styles.notificationCard, isUnread && styles.notificationCardUnread]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isUnread && styles.iconContainerUnread]}>
        <Ionicons
          name={getIconForType(item.type)}
          size={s(24)}
          color={isUnread ? colors.tint : colors.textDim}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text
            text={item.title}
            style={[styles.title, isUnread && styles.titleUnread]}
            numberOfLines={1}
          />
          {isUnread && <View style={styles.unreadDot} />}
        </View>
        <Text
          text={item.message}
          style={[styles.message, isUnread && styles.messageUnread]}
          numberOfLines={2}
        />
        <Text text={formatRelativeTime(item.createdAt)} style={styles.time} />
      </View>
      {!!imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.thumbnailImage} resizeMode="cover" />
      )}
    </TouchableOpacity>
  )
})
