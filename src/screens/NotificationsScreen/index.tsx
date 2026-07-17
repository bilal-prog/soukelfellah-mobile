import React, { FC, useMemo, useCallback, memo, useState, useEffect } from "react"
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { Ionicons } from "@expo/vector-icons"
import { useQueryClient } from "@tanstack/react-query"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { AppStackScreenProps } from "@/navigation/navigationTypes"
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "@/services/api/hooks"
import { ApiNotification } from "@/services/api/modules/notifications"

import { NotificationItem } from "./components/NotificationItem"
import { $styles } from "./styles"
import { useAppTheme } from "@/theme/context"

export const NotificationsScreen: FC<AppStackScreenProps<"Notifications">> = memo(
  function NotificationsScreen({ navigation }) {
    const { theme } = useAppTheme()
    const styles = $styles(theme)
    const colors = theme.colors
    const queryClient = useQueryClient()
    const LIMIT = 20
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [notifications, setNotifications] = useState<ApiNotification[]>([])

    // Fetch user notifications query
    const { data, isFetching, refetch, isError } = useNotificationsQuery(LIMIT, offset)
    const loading = isFetching && offset === 0
    const loadingMore = isFetching && offset > 0

    useEffect(() => {
      if (data?.notifications) {
        if (offset === 0) {
          setNotifications(data.notifications)
        } else {
          setNotifications((prev) => [...prev, ...data.notifications])
        }

        const total = data.meta?.total ?? data.notifications.length
        const currentCount = offset + data.notifications.length
        setHasMore(currentCount < total && data.notifications.length === LIMIT)
      }
    }, [data, offset])

    const markReadMutation = useMarkNotificationReadMutation()
    const deleteMutation = useDeleteNotificationMutation()

    // Mark all notifications as read
    const handleMarkAllRead = useCallback(() => {
      markReadMutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
          queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
        },
        onError: () => {
          Alert.alert("Error", "Could not mark notifications as read.")
        },
      })
    }, [markReadMutation, queryClient])

    // Handle single notification press - marks read and navigates to target listing details
    const handleNotificationPress = useCallback(
      (notification: ApiNotification) => {
        if (!notification.isRead) {
          markReadMutation.mutate(notification._id, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["notifications"] })
              queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
            },
          })
        }

        // Navigate to related listing if present in notification metadata
        if (notification.metadata?.listingId) {
          navigation.navigate("ListingDetails", { listingId: notification.metadata.listingId })
        }
      },
      [markReadMutation, queryClient, navigation],
    )

    // Soft delete confirmation dialog
    const handleDelete = useCallback(
      (id: string) => {
        Alert.alert("Delete Notification", "Are you sure you want to remove this notification?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteMutation.mutate(id, {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["notifications"] })
                  queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
                },
              })
            },
          },
        ])
      },
      [deleteMutation, queryClient],
    )

    const unreadCount = useMemo(
      () => notifications.filter((n) => !n.isRead).length,
      [notifications],
    )

    const renderItem = useCallback(
      ({ item }: { item: ApiNotification }) => {
        return (
          <NotificationItem
            item={item}
            onPress={handleNotificationPress}
            onLongPress={handleDelete}
          />
        )
      },
      [handleNotificationPress, handleDelete],
    )

    const handleGoBack = useCallback(() => {
      navigation.goBack()
    }, [navigation])

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text text="Notifications" style={styles.headerTitle} />
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} disabled={markReadMutation.isPending}>
              {markReadMutation.isPending && !markReadMutation.variables ? (
                <ActivityIndicator size="small" color={colors.tint} />
              ) : (
                <Text text="Mark all as read" style={styles.headerAction} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.center}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={colors.textDim}
              style={{ opacity: 0.5 }}
            />
            <Text text="No notifications yet" style={styles.emptyText} />
            <Text
              text="When you receive updates, they'll show up here."
              style={styles.emptySubText}
            />
          </View>
        ) : (
          <FlashList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onRefresh={() => {
              setOffset(0)
              setHasMore(true)
              refetch()
            }}
            refreshing={loading}
            onEndReached={() => {
              if (!hasMore || isFetching || loadingMore || isError) return
              setOffset((prev) => prev + LIMIT)
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Screen>
    )
  },
)

export default NotificationsScreen
