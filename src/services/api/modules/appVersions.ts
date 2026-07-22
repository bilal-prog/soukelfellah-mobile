import { apiClient } from "../apiClient"

export interface AppVersion {
  _id: string
  platform: "ios" | "android"
  versionNumber: string
  buildNumber: number
  isForceUpdate: boolean
  isInMaintenance: boolean
  releaseNotes: string
  downloadUrl: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export const getAppVersions = async (platform?: string) => {
  const params: Record<string, any> = { isActive: true }
  if (platform) {
    params.platform = platform
  }

  const response = await apiClient.get<{
    success: boolean
    message: string
    data: AppVersion[]
  }>("/api/app-versions", params)

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }

  return { kind: "ok", data: response.data?.data || [] } as const
}
