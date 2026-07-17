import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query"

import {
  login,
  logout,
  register,
  verifyOtp,
  getListings,
  getListingDetails,
  createListing,
  updateListing,
  markListingSold,
  uploadListingImage,
  getLocations,
  getCategories,
  getProductTypes,
  getMeasurementUnits,
  GetListingsParams,
  CreateListingParams,
  RegisterParams,
  getNotifications,
  markNotificationRead,
  getUnreadNotificationsCount,
  deleteNotification,
  reportListing,
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

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const res = await logout(refreshToken)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
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

export const useInfiniteListingsQuery = (
  params?: Omit<GetListingsParams, "page">,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: ["listings", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const res = await getListings({ ...params, page: pageParam as number, limit: 10 })
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.listings
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length === 10 ? allPages.length + 1 : undefined
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

export const useUpdateListingMutation = () => {
  return useMutation({
    mutationFn: async ({ id, params }: { id: string; params: CreateListingParams }) => {
      const res = await updateListing(id, params)
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

// --- Notifications Hooks ---

export const useNotificationsQuery = (limit = 20, offset = 0, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["notifications", limit, offset],
    queryFn: async () => {
      const res = await getNotifications(limit, offset)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
    },
    ...options,
  })
}

export const useInfiniteNotificationsQuery = (limit = 20, options?: { enabled?: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", limit],
    queryFn: async ({ pageParam }) => {
      const res = await getNotifications(limit, pageParam as number)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * limit
      const total = lastPage.meta?.total ?? 0
      return currentOffset < total && lastPage.notifications.length === limit ? currentOffset : undefined
    },
    ...options,
  })
}

export const useUnreadNotificationsCountQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: async () => {
      const res = await getUnreadNotificationsCount()
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res.count
    },
    ...options,
  })
}

export const useMarkNotificationReadMutation = () => {
  return useMutation({
    mutationFn: async (id?: string) => {
      const res = await markNotificationRead(id)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
    },
  })
}

export const useDeleteNotificationMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNotification(id)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
    },
  })
}

export const useReportListingMutation = () => {
  return useMutation({
    mutationFn: async ({
      listingId,
      reason,
      description,
    }: {
      listingId: string
      reason: string
      description?: string
    }) => {
      const res = await reportListing(listingId, reason, description)
      if (res.kind === "failure") throw new Error(extractErrorMessage(res.error))
      return res
    },
  })
}
