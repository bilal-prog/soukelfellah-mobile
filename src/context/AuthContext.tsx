import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from "react"
import { useMMKVString } from "react-native-mmkv"
import { OneSignal } from "react-native-onesignal"

import { socketClient } from "@/services/socket/socketClient"

export type AuthContextType = {
  isAuthenticated: boolean
  accessToken?: string
  refreshToken?: string
  userId?: string
  userName?: string
  userPhone?: string
  userRole?: string
  favorites: string[] // Array of listingIds
  isGuest: boolean
  setGuestMode: (val: boolean) => void
  setAuthSession: (
    accessToken?: string,
    refreshToken?: string,
    user?: { id: string; name: string; phone: string; role?: string },
  ) => void
  updateProfileState: (name?: string, phone?: string) => void
  toggleFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [accessToken, setAccessToken] = useMMKVString("AuthProvider.accessToken")
  const [refreshToken, setRefreshToken] = useMMKVString("AuthProvider.refreshToken")
  const [userId, setUserId] = useMMKVString("AuthProvider.userId")
  const [userName, setUserName] = useMMKVString("AuthProvider.userName")
  const [userPhone, setUserPhone] = useMMKVString("AuthProvider.userPhone")
  const [userRole, setUserRole] = useMMKVString("AuthProvider.userRole")
  const [favoritesStr, setFavoritesStr] = useMMKVString("AuthProvider.favorites")
  const [isGuestStr, setIsGuestStr] = useMMKVString("AuthProvider.isGuest")

  const isGuest = useMemo(() => isGuestStr === "true", [isGuestStr])

  // Manage socket connection lifecycle
  useEffect(() => {
    if (accessToken) {
      socketClient.connect(accessToken)
    } else {
      socketClient.disconnect()
    }
  }, [accessToken])

  const setGuestMode = useCallback(
    (val: boolean) => {
      setIsGuestStr(val ? "true" : "false")
    },
    [setIsGuestStr],
  )

  const favorites = useMemo(() => {
    try {
      const parsed = favoritesStr ? JSON.parse(favoritesStr) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [favoritesStr])

  const setAuthSession = useCallback(
    (
      accessToken?: string,
      refreshToken?: string,
      user?: { id: string; name: string; phone: string; role?: string },
    ) => {
      if (user?.id && userId && user.id !== userId) {
        setFavoritesStr(JSON.stringify([]))
      }
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setUserId(user?.id)
      setUserName(user?.name)
      setUserPhone(user?.phone)
      setUserRole(user?.role)
      setIsGuestStr("false")

      // Register session with OneSignal
      if (user?.id) {
        OneSignal.login(user.id)
      }
    },
    [
      setAccessToken,
      setRefreshToken,
      setFavoritesStr,
      setUserPhone,
      setUserId,
      setUserName,
      setUserRole,
      userId,
      setIsGuestStr,
    ],
  )

  const updateProfileState = useCallback(
    (name?: string, phone?: string) => {
      if (name !== undefined) setUserName(name)
      if (phone !== undefined) setUserPhone(phone)
    },
    [setUserName, setUserPhone],
  )

  const logout = useCallback(async () => {
    if (refreshToken) {
      const { logout } = require("@/services/api/modules/auth")
      try {
        await logout(refreshToken)
      } catch {
        // Silent catch
      }
    }
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setUserId(undefined)
    setUserName(undefined)
    setUserPhone(undefined)
    setUserRole(undefined)
    setFavoritesStr(JSON.stringify([]))
    setIsGuestStr("false")

    // Deregister user session in OneSignal
    OneSignal.logout()
  }, [
    setAccessToken,
    setRefreshToken,
    setFavoritesStr,
    setUserPhone,
    setUserId,
    setUserName,
    setUserRole,
    refreshToken,
    setIsGuestStr,
  ])

  const toggleFavorite = useCallback(
    (listingId: string) => {
      const updated = favorites.includes(listingId)
        ? favorites.filter((id: string) => id !== listingId)
        : [...favorites, listingId]
      setFavoritesStr(JSON.stringify(updated))
    },
    [favorites, setFavoritesStr],
  )

  const isFavorite = useCallback(
    (listingId: string) => {
      return favorites.includes(listingId)
    },
    [favorites],
  )

  const value = {
    isAuthenticated: !!accessToken,
    isGuest,
    setGuestMode,
    accessToken,
    refreshToken,
    userId,
    userName,
    userPhone,
    userRole,
    favorites,
    setAuthSession,
    updateProfileState,
    toggleFavorite,
    isFavorite,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
