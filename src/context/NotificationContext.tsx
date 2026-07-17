import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { OneSignal } from "react-native-onesignal"

import { InAppBanner, InAppBannerProps } from "@/components/InAppBanner"
import { socketClient } from "@/services/socket/socketClient"

export type InAppNotif =
  | (Omit<InAppBannerProps, "onDismiss" | "autoDismissMs"> & {
      data?: any
    })
  | null

const NotificationContext = createContext<{
  notification: InAppNotif
  setNotification: (n: InAppNotif) => void
}>({ notification: null, setNotification: () => {} })

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Exclude<InAppNotif, null>[]>([])
  const queryClient = useQueryClient()

  const setNotification = useCallback(
    (n: InAppNotif) => {
      if (n) {
        setQueue((prev) => [...prev, n])
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
        queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
      } else {
        // When null is passed (e.g. onDismiss), we shift the current notification off the queue
        setQueue((prev) => prev.slice(1))
      }
    },
    [queryClient],
  )

  useEffect(() => {
    const handleSocketNotification = async (payload: any) => {
      // Invalidate queries so the inbox/badge updates in real-time.
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })

      // If the user hasn't granted native push permissions, fallback to showing
      // the notification in our InAppBanner since OneSignal won't show it.
      const hasPermission = await OneSignal.Notifications.getPermissionAsync()
      if (!hasPermission && payload) {
        setNotification({
          title: payload.title,
          body: payload.message || payload.body || "",
          imageUrl: payload.data?.imageUrl || "",
        })
      }
    }

    socketClient.on("notification", handleSocketNotification)

    return () => {
      socketClient.off("notification", handleSocketNotification)
    }
  }, [queryClient, setNotification])

  const currentNotification = queue.length > 0 ? queue[0] : null

  return (
    <NotificationContext.Provider value={{ notification: currentNotification, setNotification }}>
      {children}
      {currentNotification && (
        <InAppBanner
          key={String(currentNotification.title) + String(currentNotification.body) + queue.length}
          {...currentNotification}
          onDismiss={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
