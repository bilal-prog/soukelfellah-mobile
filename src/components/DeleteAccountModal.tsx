import React, { FC, memo, useState, useCallback } from "react"
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "./Button"
import { Text } from "./Text"
import { translate } from "@/localization/translate"
import { requestDeleteAccount } from "@/services/api/modules/auth"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface DeleteAccountModalProps {
  visible: boolean
  onClose: () => void
  userPhone: string
  onSuccessLogout: () => Promise<void> | void
}

const PRESET_REASON_KEYS = [
  "deleteAccountModal:reason1",
  "deleteAccountModal:reason2",
  "deleteAccountModal:reason3",
  "deleteAccountModal:reason4",
  "deleteAccountModal:reasonOther",
] as const

export const DeleteAccountModal: FC<DeleteAccountModalProps> = memo(function DeleteAccountModal({
  visible,
  onClose,
  userPhone,
  onSuccessLogout,
}) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const [selectedReasonKey, setSelectedReasonKey] = useState<string>(PRESET_REASON_KEYS[0])
  const [customReason, setCustomReason] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = useCallback(() => {
    setSelectedReasonKey(PRESET_REASON_KEYS[0])
    setCustomReason("")
    setErrorMsg("")
    setIsLoading(false)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const handleSubmit = useCallback(async () => {
    setErrorMsg("")
    setIsLoading(true)

    const translatedReason = translate(selectedReasonKey as any)
    const isOther = selectedReasonKey === "deleteAccountModal:reasonOther"

    const finalReason = isOther
      ? customReason.trim() || translatedReason
      : translatedReason + (customReason.trim() ? ` (${customReason.trim()})` : "")

    try {
      const res = await requestDeleteAccount(userPhone, finalReason)
      setIsLoading(false)

      if (res.kind === "ok") {
        Alert.alert(
          translate("addListing:successTitle"),
          translate("deleteAccountModal:successMsg"),
          [
            {
              text: translate("common:ok"),
              onPress: async () => {
                handleClose()
                await onSuccessLogout()
              },
            },
          ],
        )
      } else {
        setErrorMsg(res.error || translate("common:error"))
      }
    } catch (err: any) {
      setIsLoading(false)
      setErrorMsg(err.message || translate("common:error"))
    }
  }, [userPhone, selectedReasonKey, customReason, handleClose, onSuccessLogout])

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropPressable}
          onPress={handleClose}
        />

        <View style={[styles.card, { backgroundColor: colors.background }, $bottomContainerInsets]}>
          {/* Top Close Button */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={s(22)} color={colors.palette.onSurfaceVariant} />
          </TouchableOpacity>

          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Icon */}
            <View style={styles.headerIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: colors.palette.error + "18" }]}>
                <Ionicons name="trash-outline" size={s(32)} color={colors.palette.error} />
              </View>
            </View>

            {/* Title */}
            <Text tx="deleteAccountModal:title" preset="bold" size="lg" style={styles.title} />

            <Text
              tx="deleteAccountModal:subtitle"
              size="xs"
              style={[styles.subtitle, { color: colors.palette.onSurfaceVariant }]}
            />

            {/* Form Content */}
            <View style={styles.form}>
              <Text tx="deleteAccountModal:selectReasonLabel" preset="bold" size="xs" style={styles.label} />

              <View style={styles.reasonsList}>
                {PRESET_REASON_KEYS.map((key) => {
                  const isSelected = selectedReasonKey === key
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.reasonChip,
                        { borderColor: isSelected ? colors.palette.primary : "rgba(0,0,0,0.12)" },
                        isSelected && { backgroundColor: colors.palette.primary + "12" },
                      ]}
                      onPress={() => setSelectedReasonKey(key)}
                    >
                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={s(18)}
                        color={isSelected ? colors.palette.primary : colors.palette.onSurfaceVariant}
                      />
                      <Text
                        tx={key as any}
                        size="xs"
                        style={[
                          styles.reasonText,
                          isSelected && { color: colors.palette.primary, fontWeight: "bold" },
                        ]}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>

              {/* Custom comment input */}
              <View style={styles.commentContainer}>
                <Text tx="deleteAccountModal:commentLabel" size="xs" style={styles.label} />
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      borderColor: "rgba(0,0,0,0.15)",
                      color: colors.text,
                      backgroundColor: colors.palette.surfaceContainerHigh || "rgba(0,0,0,0.03)",
                    },
                  ]}
                  multiline
                  numberOfLines={3}
                  placeholder={translate("deleteAccountModal:commentPlaceholder")}
                  placeholderTextColor={colors.palette.onSurfaceVariant}
                  value={customReason}
                  onChangeText={setCustomReason}
                />
              </View>

              {Boolean(errorMsg) && (
                <View style={[styles.errorCard, { backgroundColor: colors.palette.error + "15" }]}>
                  <Ionicons name="alert-circle-outline" size={s(18)} color={colors.palette.error} />
                  <Text
                    text={errorMsg}
                    size="xxs"
                    style={[styles.errorText, { color: colors.palette.error }]}
                  />
                </View>
              )}

              <Button
                preset="primary"
                style={[styles.submitBtn, { backgroundColor: colors.palette.error }]}
                textStyle={styles.submitBtnTextContainer}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text
                    tx="deleteAccountModal:submitBtn"
                    style={styles.submitBtnText}
                    size="md"
                    preset="bold"
                  />
                )}
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
})

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxHeight: "88%",
    borderRadius: s(24),
    paddingTop: vs(20),
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: vs(16),
    right: s(16),
    zIndex: 10,
    padding: s(6),
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: vs(30),
  },
  headerIconContainer: {
    marginBottom: vs(12),
    marginTop: vs(8),
  },
  iconCircle: {
    width: s(64),
    height: vs(64),
    borderRadius: s(32),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: vs(4),
  },
  subtitle: {
    textAlign: "center",
    marginBottom: vs(16),
    paddingHorizontal: s(10),
  },
  form: {
    width: "100%",
    gap: vs(12),
  },
  label: {
    marginBottom: vs(4),
    fontWeight: "600",
  },
  reasonsList: {
    gap: vs(8),
  },
  reasonChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    borderRadius: s(12),
    borderWidth: 1,
  },
  reasonText: {
    flex: 1,
  },
  commentContainer: {
    marginTop: vs(6),
  },
  textArea: {
    borderRadius: s(12),
    borderWidth: 1,
    padding: s(12),
    minHeight: vs(75),
    textAlignVertical: "top",
    fontSize: s(13),
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    padding: s(10),
    borderRadius: s(10),
  },
  errorText: {
    flex: 1,
  },
  submitBtn: {
    marginTop: vs(10),
    width: "100%",
  },
  submitBtnTextContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "white",
    width: "100%",
    textAlign: "center",
  },
})

export default DeleteAccountModal
