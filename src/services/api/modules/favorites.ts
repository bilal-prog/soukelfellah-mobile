import { apiClient } from "../apiClient"
import { ApiListing } from "./listings"

export interface ToggleFavoriteResponse {
  isFavorite: boolean
  listingId: string
  favoriteIds: string[]
}

/**
 * Fetch array of listing IDs favorited by the current logged-in user.
 */
export const getFavoriteIds = async () => {
  const response = await apiClient.get<{ success: boolean; data: string[] }>("/api/favorites/ids")

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }

  return { kind: "ok", favorites: response.data?.data || [] } as const
}

/**
 * Fetch all populated listing objects favorited by the current logged-in user.
 */
export const getUserFavorites = async () => {
  const response = await apiClient.get<{ success: boolean; data: ApiListing[] }>("/api/favorites")

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }

  return { kind: "ok", listings: response.data?.data || [] } as const
}

/**
 * Toggle favorite status of a specific listing on the backend.
 */
export const toggleFavoriteApi = async (listingId: string) => {
  const response = await apiClient.post<{ success: boolean; data: ToggleFavoriteResponse }>(
    `/api/favorites/toggle/${listingId}`,
  )

  if (!response.ok) {
    const errorData = response.data as any
    return { kind: "failure", error: errorData?.message || response.problem } as const
  }

  return {
    kind: "ok",
    isFavorite: response.data?.data?.isFavorite ?? false,
    listingId: response.data?.data?.listingId ?? listingId,
    favoriteIds: response.data?.data?.favoriteIds || [],
  } as const
}
