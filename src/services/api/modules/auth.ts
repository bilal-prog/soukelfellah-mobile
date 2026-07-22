import { apiClient } from "../apiClient"

export interface RegisterParams {
  firstName: string
  lastName: string
  phone: string
  password: string
  whatsappNumber?: string
  location: {
    address: string
    region?: string
    province?: string
  }
}

export interface ApiUser {
  id: string
  firstName: string
  lastName: string
  phone: string
  role: string
  whatsappNumber?: string
  avatarFileId?: string
}

export interface AuthResponse {
  user: ApiUser
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: ApiUser
  accessToken: string
  refreshToken: string
}

export const login = async (phone: string, password: any) => {
  const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>(
    "/api/auth/login",
    {
      phone,
      password,
    },
  )

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok", data: response.data!.data } as const
}

export const logout = async (refreshToken: string) => {
  const response = await apiClient.post("/api/auth/logout", { refreshToken })
  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok" } as const
}

export const register = async (params: RegisterParams) => {
  const response = await apiClient.post<{
    success: boolean
    message: string
    data: RegisterResponse
  }>("/api/auth/register", params)

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok", data: response.data!.data } as const
}

export const verifyOtp = async (phone: string, otp: string) => {
  const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>(
    "/api/auth/verify-otp",
    { phone, otp },
  )

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok", data: response.data!.data } as const
}

export const deleteAccount = async () => {
  const response = await apiClient.delete<{ success: boolean; message: string }>("/api/users/me")
  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok", data: response.data } as const
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await apiClient.put<{ success: boolean; message: string }>("/api/users/change-password", {
    currentPassword,
    newPassword,
  })
  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }
  return { kind: "ok", data: response.data } as const
}

