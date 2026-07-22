import React, { FC, useState, memo, useCallback } from "react"
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import i18n from "i18next"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { isRTL } from "@/localization"
import { getLegalContent, LegalTabType } from "@/localization/legalContent"
import { AppStackScreenProps } from "@/navigation/navigationTypes"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

interface LegalScreenProps extends AppStackScreenProps<"Legal"> {}

export const LegalScreen: FC<LegalScreenProps> = memo(function LegalScreen({
  navigation,
  route,
}) {
  const { theme } = useAppTheme()
  const colors = theme.colors

  const initialTab: LegalTabType = route.params?.type || "cgu"
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab)

  const doc = getLegalContent(i18n.language, activeTab)

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} style={styles.screen}>
      {/* App Bar Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text tx="legal:title" style={styles.headerTitle} preset="bold" />
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Segmented Tab Selector */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "cgu" && { backgroundColor: colors.palette.primary },
            ]}
            onPress={() => setActiveTab("cgu")}
          >
            <Text
              tx="legal:cguTab"
              style={[
                styles.tabText,
                activeTab === "cgu" ? { color: "white", fontWeight: "bold" } : { color: colors.text },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "cgv" && { backgroundColor: colors.palette.primary },
            ]}
            onPress={() => setActiveTab("cgv")}
          >
            <Text
              tx="legal:cgvTab"
              style={[
                styles.tabText,
                activeTab === "cgv" ? { color: "white", fontWeight: "bold" } : { color: colors.text },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "privacy" && { backgroundColor: colors.palette.primary },
            ]}
            onPress={() => setActiveTab("privacy")}
          >
            <Text
              tx="legal:privacyTab"
              style={[
                styles.tabText,
                activeTab === "privacy" ? { color: "white", fontWeight: "bold" } : { color: colors.text },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "mentions" && { backgroundColor: colors.palette.primary },
            ]}
            onPress={() => setActiveTab("mentions")}
          >
            <Text
              tx="legal:mentionsTab"
              style={[
                styles.tabText,
                activeTab === "mentions" ? { color: "white", fontWeight: "bold" } : { color: colors.text },
              ]}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Document Content */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.docHeader}>
          <Text style={[styles.docTitle, { color: colors.text }]} preset="bold">
            {doc.title}
          </Text>
          <View style={styles.dateRow}>
            <Text tx="legal:lastUpdated" style={[styles.dateLabel, { color: colors.palette.onSurfaceVariant }]} size="xs" />
            <Text style={[styles.dateValue, { color: colors.palette.onSurfaceVariant }]} size="xs">
              {" "}{doc.lastUpdated}
            </Text>
          </View>
        </View>

        {doc.sections.map((section, idx) => (
          <View key={idx} style={[styles.sectionCard, { backgroundColor: colors.palette.surfaceContainerHigh || "rgba(0,0,0,0.03)" }]}>
            <Text style={[styles.sectionTitle, { color: colors.palette.primary }]} preset="bold">
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, { color: colors.text }]}>
              {section.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  )
})

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  backButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: fontSizes.fs18,
  },
  headerRightPlaceholder: {
    width: s(36),
  },
  tabContainer: {
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  tabScroll: {
    paddingHorizontal: s(16),
    gap: s(8),
  },
  tabItem: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  tabText: {
    fontSize: fontSizes.fs13,
  },
  contentContainer: {
    padding: s(20),
    paddingBottom: vs(40),
  },
  docHeader: {
    marginBottom: vs(20),
  },
  docTitle: {
    fontSize: fontSizes.fs20,
    marginBottom: vs(6),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    opacity: 0.7,
  },
  dateValue: {
    opacity: 0.85,
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: s(14),
    padding: s(16),
    marginBottom: vs(14),
  },
  sectionTitle: {
    fontSize: fontSizes.fs15,
    marginBottom: vs(8),
  },
  sectionContent: {
    fontSize: fontSizes.fs14,
    lineHeight: vs(22),
    opacity: 0.9,
  },
})

export default LegalScreen
