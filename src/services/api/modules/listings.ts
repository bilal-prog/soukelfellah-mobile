import { apiClient } from "../apiClient"

export interface LocationSchema {
  address: string
  region?: string
  province?: string
  commune?: string
  village?: string
  coordinates?: {
    type: "Point"
    coordinates: [number, number] // [lng, lat]
  }
}

export interface ApiListing {
  _id: string
  title: string
  description: string
  sellerId:
    | string
    | { _id: string; firstName: string; lastName: string; phone: string; avatarFileId?: any; createdAt?: string }
  categoryId: string | { _id: string; name: string }
  productTypeId: string | { _id: string; name: string }
  productVariantId?: string
  listingType: "PRODUCT" | "EQUIPMENT"
  quantity: number
  unitId: string | { _id: string; name: string; darijaName: string }
  price?: number
  priceType: "FIXED" | "NEGOTIABLE" | "CONTACT"
  condition?: "NEW" | "USED"
  purpose: "SELL" | "RENT"
  listingDirection: "SELL" | "BUY"
  modelYear?: string
  hours?: string
  currency: string
  images: (string | { _id: string; url: string })[]
  location: LocationSchema
  status: "draft" | "active" | "paused" | "sold" | "expired" | "rejected"
  viewsCount: number
  createdAt: string
}

export interface GetListingsParams {
  search?: string
  categoryId?: string
  productTypeId?: string
  listingType?: "PRODUCT" | "EQUIPMENT"
  listingDirection?: "SELL" | "BUY"
  purpose?: "SELL" | "RENT"
  condition?: "NEW" | "USED"
  longitude?: number
  latitude?: number
  maxDistance?: number
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
  page?: number
  sellerId?: string
}

export interface CreateListingParams {
  title: string
  description: string
  categoryId: string
  productTypeId: string
  productVariantId?: string
  listingType: "PRODUCT" | "EQUIPMENT"
  quantity: number
  unitId: string
  price?: number
  priceType: "FIXED" | "NEGOTIABLE" | "CONTACT"
  condition?: "NEW" | "USED"
  purpose: "SELL" | "RENT"
  listingDirection: "SELL" | "BUY"
  images: string[] // Array of fileIds
  location: LocationSchema
  modelYear?: string
  hours?: string
}

export interface UploadFileResponse {
  _id: string
  url: string
  publicId: string
  mimeType: string
  size: number
}

export const getListings = async (params?: GetListingsParams) => {
  const response = await apiClient.get<{ success: boolean; data: ApiListing[] }>(
    "/api/listings",
    params,
  )
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", listings: response.data!.data } as const
}

export const getListingDetails = async (id: string) => {
  const response = await apiClient.get<{ success: boolean; data: ApiListing }>(
    `/api/listings/${id}`,
  )
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", listing: response.data!.data } as const
}

export const createListing = async (params: CreateListingParams) => {
  const response = await apiClient.post<{ success: boolean; data: ApiListing }>(
    "/api/listings",
    params,
  )
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", listing: response.data!.data } as const
}

export const markListingSold = async (id: string) => {
  const response = await apiClient.put<{ success: boolean; data: ApiListing }>(
    `/api/listings/${id}/sold`,
    {},
  )
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", listing: response.data!.data } as const
}

export const uploadListingImage = async (
  fileUri: string,
  fileName = "photo.jpg",
  mimeType = "image/jpeg",
) => {
  const formData = new FormData()
  // @ts-ignore
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  })

  const response = await apiClient.post<{ success: boolean; data: UploadFileResponse[] }>(
    "/api/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", file: response.data!.data[0] } as const
}
