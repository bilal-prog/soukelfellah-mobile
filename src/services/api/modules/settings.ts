import { apiClient } from "../apiClient"

export interface Settings {
  _id?: string
  phone: string
  contactEmail: string
  supportEmail: string
  isInMaintenance?: boolean
  maintenanceMessage?: {
    fr?: string
    ar?: string
    en?: string
    ary?: string
  }
  createdAt?: string
  updatedAt?: string
}

export const getSettings = async () => {
  const response = await apiClient.get<{
    success: boolean
    message: string
    data: Settings
  }>("/api/settings")

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }

  return { kind: "ok", settings: response.data?.data } as const
}
