import React, { FC, useState, memo, useCallback, useMemo } from "react"
import { View, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"

import { GuestPlaceholder } from "@/components/GuestPlaceholder"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { translate } from "@/localization/translate"
import type { MainTabScreenProps } from "@/navigation/navigationTypes"
import { useListingsQuery, useMarkListingSoldMutation } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { MyListingItem } from "./components/MyListingItem"
import { MyListingsEmptyState } from "./components/MyListingsEmptyState"
import { MyListingsHeader } from "./components/MyListingsHeader"
import { $styles } from "./styles"

interface MyListingsScreenProps extends MainTabScreenProps<"MyAccount"> {}

const MOCK_MY_LISTINGS: any[] = []

export const MyListingsScreen: FC<MyListingsScreenProps> = memo(function MyListingsScreen() {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { userId, userName, userPhone, logout, isAuthenticated } = useAuth()

  const [activeTab, setActiveTab] = useState<"active" | "paused" | "sold">("active")

  // Query active database listings belonging to this seller
  const {
    data: apiListings,
    isLoading,
    refetch,
  } = useListingsQuery(userId ? { sellerId: userId } : undefined)

  const totalViews = useMemo(() => {
    if (!apiListings) return 0
    return apiListings.reduce((sum, item) => sum + (item.viewsCount || 0), 0)
  }, [apiListings])

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  const markListingSoldMutation = useMarkListingSoldMutation()

  const handleLogout = useCallback(() => {
    Alert.alert(
      translate("myListings:logoutTitle"),
      translate("myListings:logoutConfirm"),
      [
        { text: translate("common:cancel"), style: "cancel" },
        { text: translate("myListings:logoutAction"), style: "destructive", onPress: () => logout() },
      ],
    )
  }, [logout])

  const handleDelete = useCallback((_id: string) => {
    Alert.alert(translate("myListings:deleteTitle"), translate("myListings:deleteNotSupported"))
  }, [])

  const handleMarkSold = useCallback(
    (id: string) => {
      markListingSoldMutation.mutate(id, {
        onSuccess: () => {
          Alert.alert(translate("addListing:successTitle"), translate("myListings:markSoldSuccess"))
          refetch()
        },
        onError: (err: any) => {
          Alert.alert(translate("common:error"), err.message || translate("addListing:publishErrorDefault"))
        },
      })
    },
    [markListingSoldMutation, refetch],
  )

  const visibleListings = useMemo(() => {
    const list = apiListings && apiListings.length > 0 ? apiListings : MOCK_MY_LISTINGS
    return list.filter((item) => item.status === activeTab)
  }, [apiListings, activeTab])

  const renderMyListingCard = useCallback(
    ({ item }: { item: any }) => {
      return (
        <MyListingItem
          item={item}
          activeTab={activeTab}
          onMarkSold={handleMarkSold}
          onDelete={handleDelete}
          styles={styles}
        />
      )
    },
    [activeTab, handleMarkSold, handleDelete, styles],
  )

  const renderMyListingsHeader = useCallback(() => {
    const listLength = apiListings?.length || 0
    return (
      <MyListingsHeader
        styles={styles}
        userName={userName || ""}
        userPhone={userPhone || ""}
        myListingsLength={listLength}
        viewsCount={totalViews}
        messagesCount="-"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    )
  }, [styles, userName, userPhone, apiListings, totalViews, activeTab])

  const renderMyListingsEmptyState = useCallback(() => {
    return <MyListingsEmptyState styles={styles} />
  }, [styles])

  if (!isAuthenticated) {
    return (
      <GuestPlaceholder
        icon="person-outline"
        titleTx="guest:myListingsTitle"
        descriptionTx="guest:myListingsDesc"
      />
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color={colors.palette.error} />
        </TouchableOpacity>
        <Text tx="myListings:title" style={styles.headerTitle} preset="bold" />
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main dashboard list utilizing FlatList */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={visibleListings}
          keyExtractor={(item) => item._id}
          renderItem={renderMyListingCard}
          ListHeaderComponent={renderMyListingsHeader}
          ListEmptyComponent={renderMyListingsEmptyState}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
})

export default MyListingsScreen
