import { apiClient } from "../apiClient"

export const reportListing = async (listingId: string, reason: string, description?: string) => {
  const response = await apiClient.post<any>("/api/reports", {
    listingId,
    reason,
    description,
  })

  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok" } as const
}
