import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// Bottom Tab Route Params
export type MainTabParamList = {
  Home: undefined
  Search: undefined
  Add: undefined
  Favorites: undefined
  MyAccount: undefined
}

// Global Stack Route Params
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Register: undefined
  VerifyPhone: { phone: string; registrationParams: any }
  MainTabs: NavigatorScreenParams<MainTabParamList>
  ListingDetails: { listingId: string }
  Notifications: undefined
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}
