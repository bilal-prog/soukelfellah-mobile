import React, { FC, memo, useCallback } from "react"
import { Modal, View, StyleSheet, Linking, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "./Button"
import { Text } from "./Text"
import { AppVersion } from "@/services/api/modules/appVersions"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"
import { getCurrentAppInfo } from "@/utils/versionCheck"

interface UpdateModalProps {
  visible: boolean
  isForceUpdate: boolean
  latestVersion?: AppVersion
  onDismiss?: () => void
}

export const UpdateModal: FC<UpdateModalProps> = memo(function UpdateModal({
  visible,
  isForceUpdate,
  latestVersion,
  onDismiss,
}) {
  const { theme } = useAppTheme()
  const appInfo = getCurrentAppInfo()

  const handleUpdate = useCallback(async () => {
    if (latestVersion?.downloadUrl) {
      try {
        const supported = await Linking.canOpenURL(latestVersion.downloadUrl)
        if (supported) {
          await Linking.openURL(latestVersion.downloadUrl)
        } else {
          await Linking.openURL(latestVersion.downloadUrl)
        }
      } catch (err) {
        console.warn("Failed to open download URL:", err)
      }
    }
  }, [latestVersion?.downloadUrl])

  if (!visible || !latestVersion) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => {
        if (!isForceUpdate && onDismiss) {
          onDismiss()
        }
      }}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          {/* Header Icon */}
          <View style={styles.headerIconContainer}>
            <View
              style={[styles.iconCircle, { backgroundColor: theme.colors.palette.primary + "18" }]}
            >
              <Ionicons
                name="cloud-download-outline"
                size={44}
                color={theme.colors.palette.primary}
                style={styles.iconStyle}
              />
            </View>

          </View>

          {/* Title & Description */}
          <Text
            tx={isForceUpdate ? "version:forceUpdateTitle" : "version:optionalUpdateTitle"}
            preset="bold"
            style={styles.title}
          />

          <Text
            tx={isForceUpdate ? "version:forceUpdateMessage" : "version:optionalUpdateMessage"}
            style={styles.message}
          />

          {/* Versions Comparison Badge */}
          <View
            style={[
              styles.versionBadge,
              { backgroundColor: theme.colors.palette.secondary + "15" },
            ]}
          >
            <Text style={styles.versionBadgeText}>
              v{appInfo.version} → v{latestVersion.versionNumber}
            </Text>
          </View>

          {/* Release Notes */}
          {Boolean(latestVersion.releaseNotes?.trim()) && (
            <View style={styles.notesContainer}>
              <Text tx="version:releaseNotes" preset="bold" style={styles.notesHeader} />
              <ScrollView style={styles.notesScroll} nestedScrollEnabled>
                <Text style={styles.notesText}>{latestVersion.releaseNotes}</Text>
              </ScrollView>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              preset="primary"
              style={[styles.updateBtn, { backgroundColor: theme.colors.palette.primary }]}
              onPress={handleUpdate}
              tx="version:updateNow"
            />

            {!isForceUpdate && onDismiss && (
              <TouchableOpacity style={styles.laterBtn} onPress={onDismiss}>
                <Text tx="version:later" style={styles.laterText} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(24),
  },
  card: {
    width: "100%",
    borderRadius: s(20),
    padding: s(24),
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  headerIconContainer: {
    marginBottom: vs(16),
  },
  iconCircle: {
    width: s(80),
    height: vs(80),
    borderRadius: s(40),
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  iconStyle: {
    width: s(60),
    height: vs(60),
    lineHeight: vs(60),
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    alignSelf: "center",
    writingDirection: "ltr",
  },

  title: {
    fontSize: fontSizes.fs20,
    textAlign: "center",
    marginBottom: vs(8),
  },
  message: {
    fontSize: fontSizes.fs14,
    textAlign: "center",
    lineHeight: vs(20),
    opacity: 0.8,
    marginBottom: vs(14),
  },
  versionBadge: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: s(16),
    marginBottom: vs(16),
  },
  versionBadgeText: {
    fontSize: fontSizes.fs13,
    fontWeight: "600",
  },
  notesContainer: {
    width: "100%",
    maxHeight: vs(120),
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(20),
  },
  notesHeader: {
    fontSize: fontSizes.fs13,
    marginBottom: vs(4),
  },
  notesScroll: {
    maxHeight: vs(80),
  },
  notesText: {
    fontSize: fontSizes.fs13,
    lineHeight: vs(18),
    opacity: 0.85,
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  updateBtn: {
    width: "100%",
    borderRadius: s(12),
  },
  laterBtn: {
    marginTop: vs(14),
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
  },
  laterText: {
    fontSize: fontSizes.fs14,
    opacity: 0.7,
  },
})

export default UpdateModal
