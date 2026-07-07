import { useQuery, useMutation } from "@tanstack/react-query"

import {
  login,
  register,
  verifyOtp,
  getListings,
  getListingDetails,
  createListing,
  markListingSold,
  uploadListingImage,
  getLocations,
  getCategories,
  getProductTypes,
  getMeasurementUnits,
  GetListingsParams,
  CreateListingParams,
  RegisterParams,
} from "../modules"

const extractErrorMessage = (error: any): string => {
  if (!error) return "Unknown error"
  if (typeof error === "string") return error
  if (typeof error === "object") {
    if (typeof error.message === "string") return error.message
    if (typeof error.error === "string") return error.error
  }
  return JSON.stringify(error)
}

// --- Authentication Hooks ---

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async ({ phone, password }: { phone: string; password: any }) => {
      const res = await login(phone, password)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.data
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (params: RegisterParams) => {
      const res = await register(params)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.data
    },
  })
}

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      const res = await verifyOtp(phone, otp)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.data
    },
  })
}

// --- Listings Hooks ---

export const useListingsQuery = (params?: GetListingsParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: async () => {
      const res = await getListings(params)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.listings
    },
    ...options,
  })
}

export const useListingDetailsQuery = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["listingDetails", id],
    queryFn: async () => {
      const res = await getListingDetails(id)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.listing
    },
    ...options,
  })
}

export const useCreateListingMutation = () => {
  return useMutation({
    mutationFn: async (params: CreateListingParams) => {
      const res = await createListing(params)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.listing
    },
  })
}

export const useMarkListingSoldMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await markListingSold(id)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.listing
    },
  })
}

export const useUploadListingImageMutation = () => {
  return useMutation({
    mutationFn: async ({
      fileUri,
      fileName,
      mimeType,
    }: {
      fileUri: string
      fileName?: string
      mimeType?: string
    }) => {
      const res = await uploadListingImage(fileUri, fileName, mimeType)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.file
    },
  })
}

// --- Location & Reference Data Hooks ---

export const useLocationsQuery = (
  params?: { type?: string; parentId?: string },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["locations", params],
    queryFn: async () => {
      const res = await getLocations(params)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.locations
    },
    ...options,
  })
}

export const useCategoriesQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories()
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.categories
    },
    ...options,
  })
}

export const useProductTypesQuery = (categoryId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["productTypes", categoryId],
    queryFn: async () => {
      const res = await getProductTypes(categoryId)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.productTypes
    },
    ...options,
  })
}

export const useMeasurementUnitsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["measurementUnits"],
    queryFn: async () => {
      const res = await getMeasurementUnits()
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.units
    },
    ...options,
  })
}
