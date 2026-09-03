import * as Sentry from "@sentry/react-native"
import { create, ApisauceInstance } from "apisauce"

import Config from "@/config"
import { loadString } from "@/utils/storage"

export const apiClient: ApisauceInstance = create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
})

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.setHeader("Authorization", `Bearer ${token}`)
  } else {
    apiClient.deleteHeader("Authorization")
  }
}

// Request transform to automatically attach Access Token from MMKV
apiClient.addRequestTransform((request) => {
  const token = loadString("AuthProvider.accessToken")
  if (token) {
    request.headers = request.headers || {}
    request.headers.Authorization = `Bearer ${token}`
  }
})

let onUnauthorizedCallback: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorizedCallback = handler
}

export const notifyUnauthorized = () => {
  if (onUnauthorizedCallback) {
    onUnauthorizedCallback()
  }
}

apiClient.axiosInstance.interceptors.response.use(
  async (response) => {
    const originalRequest = response.config as any
    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/register")

    if (response.status >= 500) {
      Sentry.captureException(new Error(`API Error ${response.status}: ${originalRequest?.url}`), {
        tags: {
          api_endpoint: originalRequest?.url,
          api_method: originalRequest?.method?.toUpperCase(),
          api_status: response.status,
        },
        extra: {
          responseData: response.data,
        },
      })
    }

    if (response.status === 401 && originalRequest && !isAuthRoute) {
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        notifyUnauthorized()
        return response
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = loadString("AuthProvider.refreshToken")
        if (refreshToken) {
          try {
            // Attempt to call refresh token endpoint
            const refreshRes = await create({ baseURL: Config.API_URL }).post<any>(
              "/api/auth/refresh",
              { refreshToken },
            )
            const newAccessToken = refreshRes.data?.data?.accessToken
            if (refreshRes.ok && newAccessToken) {
              const { saveString } = require("@/utils/storage")
              saveString("AuthProvider.accessToken", newAccessToken)
              setAuthToken(newAccessToken)

              // Set header on retried request config
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
              originalRequest.headers["authorization"] = `Bearer ${newAccessToken}`
              if (originalRequest.headers.set) {
                originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`)
                originalRequest.headers.set("authorization", `Bearer ${newAccessToken}`)
              }

              const retryResponse = await apiClient.axiosInstance(originalRequest)
              if (retryResponse.status === 401) {
                notifyUnauthorized()
              }
              return retryResponse
            }
          } catch (e) {
            // Token refresh failed
          }
        }
        notifyUnauthorized()
      } else {
        notifyUnauthorized()
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as any
    const isAuthRoute =
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/register")

    const status = error.response?.status
    if (!status || status >= 500) {
      Sentry.captureException(error, {
        tags: {
          api_endpoint: originalRequest?.url,
          api_method: originalRequest?.method?.toUpperCase(),
          api_status: status || "NETWORK_ERROR",
        },
        extra: {
          responseData: error.response?.data,
        },
      })
    }

    if (error.response?.status === 401 && originalRequest && !isAuthRoute) {
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        notifyUnauthorized()
        return Promise.reject(error)
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = loadString("AuthProvider.refreshToken")
        if (refreshToken) {
          try {
            // Attempt to call refresh token endpoint
            const refreshRes = await create({ baseURL: Config.API_URL }).post<any>(
              "/api/auth/refresh",
              { refreshToken },
            )
            const newAccessToken = refreshRes.data?.data?.accessToken
            if (refreshRes.ok && newAccessToken) {
              const { saveString } = require("@/utils/storage")
              saveString("AuthProvider.accessToken", newAccessToken)
              setAuthToken(newAccessToken)

              // Set header on retried request config
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
              originalRequest.headers["authorization"] = `Bearer ${newAccessToken}`
              if (originalRequest.headers.set) {
                originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`)
                originalRequest.headers.set("authorization", `Bearer ${newAccessToken}`)
              }

              return apiClient.axiosInstance(originalRequest)
            }
          } catch (e) {
            // Token refresh failed
          }
        }
        notifyUnauthorized()
      } else {
        notifyUnauthorized()
      }
    }
    return Promise.reject(error)
  },
)

export const getAbsoluteUrl = (url?: string): string | undefined => {
  if (!url) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${Config.API_URL}${url}`
}
