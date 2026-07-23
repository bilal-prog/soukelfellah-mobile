import React, { FC, useMemo, useCallback, memo } from "react"
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { Ionicons } from "@expo/vector-icons"
import { useQueryClient } from "@tanstack/react-query"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { translate } from "@/localization/translate"
import { AppStackScreenProps } from "@/navigation/navigationTypes"
import {
  useInfiniteNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "@/services/api/hooks"
import { ApiNotification } from "@/services/api/modules/notifications"

import { NotificationItem } from "./components/NotificationItem"
import { $styles } from "./styles"
import { useAppTheme } from "@/theme/context"
import { isRTL } from "@/localization"

export const NotificationsScreen: FC<AppStackScreenProps<"Notifications">> = memo(
  function NotificationsScreen({ navigation }) {
    const { theme } = useAppTheme()
    const styles = $styles(theme)
    const colors = theme.colors
    const queryClient = useQueryClient()
    const LIMIT = 20

    // Fetch user notifications query via React Query infinite query
    const { data, isFetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useInfiniteNotificationsQuery(LIMIT)

    // Flat list of notifications computed dynamically
    const notifications = useMemo(() => {
      return data?.pages.flatMap((page) => page.notifications) || []
    }, [data])

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
          Alert.alert(translate("common:error"), "Could not mark notifications as read.")
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
        Alert.alert(
          translate("notifications:deleteTitle"),
          translate("notifications:deleteConfirm"),
          [
            { text: translate("common:cancel"), style: "cancel" },
            {
              text: translate("notifications:deleteAction"),
              style: "destructive",
              onPress: () => {
                deleteMutation.mutate(id, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["notifications"] })
                    queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
                  },
                  onError: () => {
                    Alert.alert(translate("common:error"), "Could not delete notification.")
                  },
                })
              },
            },
          ],
        )
      },
      [deleteMutation, queryClient],
    )

    // Count of unread notifications from local computed array
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

    const loading = isLoading && notifications.length === 0

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons
                name={isRTL ? "arrow-forward" : "arrow-back"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <Text tx="notifications:title" style={styles.headerTitle} />
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} disabled={markReadMutation.isPending}>
              {markReadMutation.isPending && !markReadMutation.variables ? (
                <ActivityIndicator size="small" color={colors.tint} />
              ) : (
                <Text tx="notifications:markAllRead" style={styles.headerAction} />
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
            <Text tx="notifications:emptyTitle" style={styles.emptyText} />
            <Text tx="notifications:emptyDesc" style={styles.emptySubText} />
          </View>
        ) : (
          <FlashList
            data={notifications}
            keyExtractor={(item) => item?._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onRefresh={refetch}
            refreshing={isFetching && !isFetchingNextPage}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
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
