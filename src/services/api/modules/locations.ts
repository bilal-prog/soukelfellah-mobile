import { apiClient } from "../apiClient"

export interface ApiLocationReference {
  _id: string
  name: string
  darijaName?: string
  type: "region" | "province" | "commune" | "village"
  parentId?: string
  coordinates?: {
    type: "Point"
    coordinates: [number, number]
  }
}

export interface ApiCategory {
  _id: string
  name: string
  slug: string
  icon?: string | { _id: string; url: string }
}

export interface ApiProductType {
  _id: string
  categoryId: string
  name: string
  slug: string
  allowedUnits: string[] | any[]
}

export interface ApiMeasurementUnit {
  _id: string
  name: string
  darijaName?: string
}

export const getLocations = async (params?: { type?: string; parentId?: string }) => {
  const response = await apiClient.get<{
    success: boolean
    message: string
    data: ApiLocationReference[]
  }>("/api/locations", params)
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", locations: response.data!.data } as const
}

export const getCategories = async () => {
  const response = await apiClient.get<{ success: boolean; message: string; data: ApiCategory[] }>(
    "/api/categories",
  )
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", categories: response.data!.data } as const
}

export const getProductTypes = async (categoryId?: string) => {
  const response = await apiClient.get<{
    success: boolean
    message: string
    data: ApiProductType[]
  }>("/api/product-types", { categoryId })
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", productTypes: response.data!.data } as const
}

export const getMeasurementUnits = async () => {
  const response = await apiClient.get<{
    success: boolean
    message: string
    data: ApiMeasurementUnit[]
  }>("/api/measurement-units")
  if (!response.ok) {
    return { kind: "failure", error: response.data || response.problem } as const
  }
  return { kind: "ok", units: response.data!.data } as const
}
