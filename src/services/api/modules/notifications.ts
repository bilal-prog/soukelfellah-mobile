import { apiClient } from "../apiClient"

export type NotificationType = "view" | "like" | "system" | "marketing"

export interface ApiNotification {
  _id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  isDeleted: boolean
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface ApiMeta {
  total: number
  limit: number
  offset: number
}

export interface ApiNotificationsResponse {
  success: boolean
  data: ApiNotification[]
  meta?: ApiMeta
}

/**
 * Fetch a list of notifications for the logged-in user.
 */
export const getNotifications = async (limit = 20, offset = 0) => {
  const response = await apiClient.get<ApiNotificationsResponse>("/api/notifications", {
    limit,
    offset,
  })

  if (!response.ok) {
    return { kind: "failure", error: response.problem } as const
  }

  return {
    kind: "ok",
    notifications: response.data?.data || [],
    meta: response.data?.meta,
  } as const
}

/**
 * Mark a single notification as read, or all if no id is provided.
 */
export const markNotificationRead = async (id?: string) => {
  const response = await apiClient.patch("/api/notifications/read", id ? { notificationId: id } : {})
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok" } as const
}

/**
 * Fetch the current unread count of notifications.
 */
export const getUnreadNotificationsCount = async () => {
  const response = await apiClient.get<{ count: number }>("/api/notifications/unread-count")
  if (!response.ok) {
    return { kind: "failure", error: response.problem } as const
  }
  return { kind: "ok", count: response.data?.count || 0 } as const
}

/**
 * Soft delete a notification by ID.
 */
export const deleteNotification = async (id: string) => {
  const response = await apiClient.delete(`/api/notifications/${id}`)
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok" } as const
}
