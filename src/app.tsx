import "react-native-gesture-handler"
import { useEffect, useState } from "react"
import { AppState, AppStateStatus } from "react-native"
import { useFonts } from "expo-font"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { OneSignal, LogLevel } from "react-native-onesignal"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider, useNotification } from "./context/NotificationContext"
import { VersionProvider, useVersion } from "./context/VersionContext"
import { initI18n } from "./localization"
import { AppNavigator } from "./navigation/AppNavigator"
import { MaintenanceScreen } from "./screens/MaintenanceScreen"
import { UpdateModal } from "./components/UpdateModal"
import { NetworkBanner } from "./components/NetworkBanner"
import { ThemeProvider } from "./theme/context"

import { customFontsToLoad } from "./theme/typography"
import { loadDateFnsLocale } from "./utils/formatDate"

// Enable OneSignal verbose debug logs to trace notifications flow
OneSignal.Debug.setLogLevel(LogLevel.Verbose)

// Initialize OneSignal with EXPO_PUBLIC_ONESIGNAL_APP_ID from .env.local
const oneSignalAppId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID
if (oneSignalAppId) {
  OneSignal.initialize(oneSignalAppId)
  console.log("[OneSignal] Initialized with App ID:", oneSignalAppId)
} else {
  console.warn("[OneSignal] APP ID is not defined in EXPO_PUBLIC_ONESIGNAL_APP_ID.")
}

const queryClient = new QueryClient()

export function App() {
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    // 1. Initialize translation resources and date-fns locale
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
      .catch((err) => console.log("i18n init error:", err))
  }, [])

  if (!isI18nInitialized || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <VersionProvider>
                <NotificationProvider>
                  <AppContent />
                </NotificationProvider>
              </VersionProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}

function AppContent() {
  const { setNotification } = useNotification()
  const queryClient = useQueryClient()
  const {
    isMaintenance,
    isForceUpdate,
    isOptionalUpdate,
    latestVersion,
    dismissOptionalUpdate,
    checkVersion,
    isChecking,
  } = useVersion()

  useEffect(() => {
    // 1. Request push notification permissions on startup
    OneSignal.Notifications.requestPermission(true)

    // 2. Refresh unread count on AppState change (from killed/background to active)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
      }
    }

    const appStateSubscription = AppState.addEventListener("change", handleAppStateChange)

    // 3. Define event listeners for clicks and foreground displays
    const clickListener = (event: any) => {
      console.log("OneSignal: notification clicked:", event)
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }

    const foregroundListener = (event: any) => {
      event.preventDefault()
      const notification = event.getNotification()
      const { title, body, additionalData, bigPicture, largeIcon } = notification
      setNotification({
        title,
        body,
        data: additionalData,
        imageUrl: bigPicture || largeIcon,
      })
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }

    OneSignal.Notifications.addEventListener("click", clickListener)
    OneSignal.Notifications.addEventListener("foregroundWillDisplay", foregroundListener)

    // Cleanup listeners on unmount
    return () => {
      appStateSubscription.remove()
      OneSignal.Notifications.removeEventListener("click", clickListener)
      OneSignal.Notifications.removeEventListener("foregroundWillDisplay", foregroundListener)
    }
  }, [setNotification, queryClient])

  if (isMaintenance) {
    return <MaintenanceScreen onRetry={checkVersion} isChecking={isChecking} />
  }

  return (
    <>
      <NetworkBanner />
      <AppNavigator />
      <UpdateModal
        visible={isForceUpdate || isOptionalUpdate}
        isForceUpdate={isForceUpdate}
        latestVersion={latestVersion}
        onDismiss={dismissOptionalUpdate}
      />
    </>
  )
}
export default App
