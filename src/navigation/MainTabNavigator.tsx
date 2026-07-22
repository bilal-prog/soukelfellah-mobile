import { TextStyle, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { translate } from "@/localization/translate"
import { AddListingScreen } from "@/screens/AddListingScreen"
import { FavoritesScreen } from "@/screens/FavoritesScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { MyListingsScreen } from "@/screens/MyListingsScreen"
import { SearchScreen } from "@/screens/SearchScreen"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { vs } from "@/utils/scaling"

import type { MainTabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainTabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.palette.primary,
        tabBarInactiveTintColor: colors.palette.onSurfaceVariant,
        tabBarStyle: [themed($tabBar), { height: 60 + bottom, paddingBottom: bottom }],
        tabBarItemStyle: themed($tabBarItem),
        tabBarLabelStyle: themed($tabBarLabel),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: translate("home:title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: translate("search:title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddListingScreen}
        options={{
          tabBarLabel: translate("addListing:title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: translate("common:favorites"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyAccount"
        component={MyListingsScreen}
        options={{
          tabBarLabel: translate("myListings:title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.surfaceContainer,
  borderTopColor: colors.palette.outlineVariant,
  borderTopWidth: 1,
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs || 8,
  paddingBottom: spacing.xs || 8,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: fontSizes.fs12,
  fontFamily: typography.primary.medium,
  lineHeight: vs(25),
})

export default MainTabNavigator
