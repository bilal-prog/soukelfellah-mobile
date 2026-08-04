import React, { memo } from "react"
import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Text } from "@/components/Text"
import { translate } from "@/localization/translate"
import { useAppTheme } from "@/theme/context"
import { vs } from "@/utils/scaling"

export interface MyListingsHeaderProps {
  styles: any
  userName: string
  userPhone: string
  myListingsLength: number
  viewsCount: number
  callsCount: number
  messagesCount: number
  activeTab: "active" | "paused" | "sold" | "rejected"
  setActiveTab: (val: "active" | "paused" | "sold" | "rejected") => void
}

export const MyListingsHeader = memo(function MyListingsHeader(props: MyListingsHeaderProps) {
  const {
    styles,
    userName,
    userPhone,
    myListingsLength,
    viewsCount,
    callsCount,
    messagesCount,
    activeTab,
    setActiveTab,
  } = props
  const { theme } = useAppTheme()
  const colors = theme.colors

  return (
    <View>
      {/* Profile Header Info */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={vs(32)} color={colors.palette.primary} />
        </View>
        <View style={styles.profileDetails}>
          <Text text={userName || translate("common:farmer")} preset="bold" size="md" />
          <Text text={userPhone || "06XXXXXXXX"} size="xs" style={styles.profilePhone} />
        </View>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text tx="myListings:stats.total" size="xxs" style={styles.statLabel} />
            <Text
              text={String(myListingsLength)}
              preset="bold"
              size="md"
              style={styles.statValueTotal}
            />
          </View>
          <View style={styles.statBox}>
            <Text tx="myListings:stats.views" size="xxs" style={styles.statLabel} />
            <Text text={String(viewsCount)} preset="bold" size="md" style={styles.statValueViews} />
          </View>
          <View style={styles.statBox}>
            <Text tx="myListings:stats.calls" size="xxs" style={styles.statLabel} />
            <Text text={String(callsCount)} preset="bold" size="md" style={styles.statValueCalls} />
          </View>
          <View style={styles.statBox}>
            <Text tx="myListings:stats.messages" size="xxs" style={styles.statLabel} />
            <Text
              text={String(messagesCount)}
              preset="bold"
              size="md"
              style={styles.statValueMessages}
            />
          </View>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setActiveTab("active")} style={styles.tabButton}>
            <Text
              tx="myListings:tabs.active"
              size="xs"
              preset="bold"
              style={activeTab === "active" ? styles.tabTextActive : styles.tabTextInactive}
            />
            {activeTab === "active" && <View style={styles.activeTabBar} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("paused")} style={styles.tabButton}>
            <Text
              tx="myListings:tabs.paused"
              size="xs"
              preset="bold"
              style={activeTab === "paused" ? styles.tabTextActive : styles.tabTextInactive}
            />
            {activeTab === "paused" && <View style={styles.activeTabBar} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("sold")} style={styles.tabButton}>
            <Text
              tx="myListings:tabs.sold"
              size="xs"
              preset="bold"
              style={activeTab === "sold" ? styles.tabTextActive : styles.tabTextInactive}
            />
            {activeTab === "sold" && <View style={styles.activeTabBar} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("rejected")} style={styles.tabButton}>
            <Text
              tx="myListings:tabs.rejected"
              size="xs"
              preset="bold"
              style={activeTab === "rejected" ? styles.tabTextActive : styles.tabTextInactive}
            />
            {activeTab === "rejected" && <View style={styles.activeTabBar} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})
