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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "./Button"
import { Text } from "./Text"
import { TextField, TextFieldAccessoryProps } from "./TextField"
import { translate } from "@/localization/translate"
import { changePassword } from "@/services/api/modules/auth"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

interface ChangePasswordModalProps {
  visible: boolean
  onClose: () => void
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = memo(function ChangePasswordModal({
  visible,
  onClose,
}) {
  const { theme } = useAppTheme()
  const colors = theme.colors

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = useCallback(() => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setErrorMsg("")
    setIsLoading(false)
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const handleSubmit = useCallback(async () => {
    setErrorMsg("")

    if (!currentPassword.trim()) {
      setErrorMsg(translate("changePassword:currentRequired"))
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(translate("changePassword:minLength"))
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(translate("changePassword:mismatch"))
      return
    }

    setIsLoading(true)
    try {
      const res = await changePassword(currentPassword, newPassword)
      setIsLoading(false)

      if (res.kind === "ok") {
        Alert.alert(translate("addListing:successTitle"), translate("changePassword:success"))
        handleClose()
      } else {
        setErrorMsg(res.error || translate("common:error"))
      }
    } catch (err: any) {
      setIsLoading(false)
      setErrorMsg(err.message || translate("common:error"))
    }
  }, [currentPassword, newPassword, confirmPassword, handleClose])

  const renderCurrentLeft = useCallback(
    (props: TextFieldAccessoryProps) => (
      <View style={props.style}>
        <Ionicons name="lock-closed-outline" size={s(20)} color={colors.palette.onSurfaceVariant} />
      </View>
    ),
    [colors],
  )

  const renderCurrentRight = useCallback(
    (props: TextFieldAccessoryProps) => (
      <TouchableOpacity onPress={() => setShowCurrentPassword((prev) => !prev)} style={props.style}>
        <Ionicons
          name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
          size={s(20)}
          color={colors.palette.onSurfaceVariant}
        />
      </TouchableOpacity>
    ),
    [showCurrentPassword, colors],
  )

  const renderNewLeft = useCallback(
    (props: TextFieldAccessoryProps) => (
      <View style={props.style}>
        <Ionicons name="key-outline" size={s(20)} color={colors.palette.onSurfaceVariant} />
      </View>
    ),
    [colors],
  )

  const renderNewRight = useCallback(
    (props: TextFieldAccessoryProps) => (
      <TouchableOpacity onPress={() => setShowNewPassword((prev) => !prev)} style={props.style}>
        <Ionicons
          name={showNewPassword ? "eye-off-outline" : "eye-outline"}
          size={s(20)}
          color={colors.palette.onSurfaceVariant}
        />
      </TouchableOpacity>
    ),
    [showNewPassword, colors],
  )

  const renderConfirmLeft = useCallback(
    (props: TextFieldAccessoryProps) => (
      <View style={props.style}>
        <Ionicons
          name="checkmark-circle-outline"
          size={s(20)}
          color={colors.palette.onSurfaceVariant}
        />
      </View>
    ),
    [colors],
  )

  const renderConfirmRight = useCallback(
    (props: TextFieldAccessoryProps) => (
      <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} style={props.style}>
        <Ionicons
          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
          size={s(20)}
          color={colors.palette.onSurfaceVariant}
        />
      </TouchableOpacity>
    ),
    [showConfirmPassword, colors],
  )

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

        <View style={[styles.card, { backgroundColor: colors.background }]}>
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
              <View style={[styles.iconCircle, { backgroundColor: colors.palette.primary + "18" }]}>
                <Ionicons name="key-outline" size={s(32)} color={colors.palette.primary} />
              </View>
            </View>

            {/* Title */}
            <Text tx="changePassword:title" preset="bold" style={styles.title} />

            {/* Form Fields */}
            <View style={styles.form}>
              <TextField
                containerStyle={styles.fieldContainer}
                labelTx="changePassword:currentPassword"
                placeholder="••••••••"
                value={currentPassword}
                onChangeText={(val) => {
                  setCurrentPassword(val)
                  if (errorMsg) setErrorMsg("")
                }}
                secureTextEntry={!showCurrentPassword}
                LeftAccessory={renderCurrentLeft}
                RightAccessory={renderCurrentRight}
              />

              <TextField
                containerStyle={styles.fieldContainer}
                labelTx="changePassword:newPassword"
                placeholder="••••••••"
                value={newPassword}
                onChangeText={(val) => {
                  setNewPassword(val)
                  if (errorMsg) setErrorMsg("")
                }}
                secureTextEntry={!showNewPassword}
                LeftAccessory={renderNewLeft}
                RightAccessory={renderNewRight}
              />

              <TextField
                containerStyle={styles.fieldContainer}
                labelTx="changePassword:confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val)
                  if (errorMsg) setErrorMsg("")
                }}
                secureTextEntry={!showConfirmPassword}
                LeftAccessory={renderConfirmLeft}
                RightAccessory={renderConfirmRight}
              />

              {Boolean(errorMsg) && (
                <View style={[styles.errorCard, { backgroundColor: colors.palette.error + "15" }]}>
                  <Ionicons name="alert-circle-outline" size={s(18)} color={colors.palette.error} />
                  <Text
                    text={errorMsg}
                    style={[styles.errorText, { color: colors.palette.error }]}
                  />
                </View>
              )}

              <Button
                preset="primary"
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text tx="changePassword:submit" style={styles.submitBtnText} preset="bold" />
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
    maxHeight: "85%",
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
    fontSize: fontSizes.fs20,
    lineHeight: vs(28),
    textAlign: "center",
    marginBottom: vs(16),
  },
  form: {
    width: "100%",
    gap: vs(14),
  },
  fieldContainer: {
    width: "100%",
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
    fontSize: fontSizes.fs13,
    lineHeight: vs(18),
  },
  submitBtn: {
    marginTop: vs(8),
  },
  submitBtnText: {
    color: "white",
    fontSize: fontSizes.fs16,
  },
})

export default ChangePasswordModal
