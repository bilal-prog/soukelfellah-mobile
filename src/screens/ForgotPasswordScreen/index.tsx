import React, { FC, useState, memo, useCallback } from "react"
import { View, TouchableOpacity, Linking, StyleSheet, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import Config from "@/config"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useAppTheme } from "@/theme/context"

import { CallIcon } from "../LoginScreen/components/CallIcon"

interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = memo(
  function ForgotPasswordScreen({ navigation, route }) {
    const { theme } = useAppTheme()
    const colors = theme.colors

    const initialPhone = route.params?.phone || ""
    const [phone, setPhone] = useState(initialPhone)
    const [phoneError, setPhoneError] = useState("")

    const handleGoBack = useCallback(() => {
      navigation.goBack()
    }, [navigation])

    const handleWhatsAppReset = useCallback(async () => {
      if (!phone.trim()) {
        setPhoneError(translate("login:phoneRequired"))
        return
      }
      if (phone.trim().length < 10) {
        setPhoneError(translate("login:phoneInvalid"))
        return
      }
      setPhoneError("")

      const message = `السلام عليكم، أريد إعادة تعيين كلمة السر لحسابي رقم: ${phone.trim()}`
      const targetPhone = Config.SUPPORT_WHATSAPP || "212722957826"
      const nativeUrl = `whatsapp://send?phone=${targetPhone}&text=${encodeURIComponent(message)}`
      const webUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`

      try {
        const canOpenNative = await Linking.canOpenURL(nativeUrl)
        if (canOpenNative) {
          await Linking.openURL(nativeUrl)
        } else {
          await Linking.openURL(webUrl)
        }
      } catch (err) {
        console.warn("Failed to open WhatsApp URL:", err)
        Alert.alert(translate("common:error"), "Could not open WhatsApp. Please try again.")
      }
    }, [phone])

    const handleCallSupport = useCallback(async () => {
      const telUrl = `tel:${Config.SUPPORT_PHONE || "+212722957826"}`
      try {
        await Linking.openURL(telUrl)
      } catch (err) {
        console.warn("Failed to open Phone dialer:", err)
      }
    }, [])

    return (
      <Screen preset="scroll" safeAreaEdges={["top", "bottom"]} style={styles.screen}>
        {/* Top Header */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Visual Header */}
          <View style={styles.headerSection}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.palette.primary + "15" },
              ]}
            >
              <Ionicons
                name="logo-whatsapp"
                size={48}
                color="#25D366"
                style={styles.whatsappIcon}
              />
            </View>

            <Text tx="forgotPassword:title" style={styles.title} preset="heading" />
            <Text tx="forgotPassword:subtitle" style={styles.subtitle} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextField
              value={phone}
              onChangeText={(val) => {
                setPhone(val)
                if (phoneError) setPhoneError("")
              }}
              placeholder="06 XX XX XX XX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              labelTx="login:phone"
              helper={phoneError}
              status={phoneError ? "error" : undefined}
              LeftAccessory={CallIcon}
              containerStyle={styles.inputGroup}
            />

            {/* WhatsApp Reset Button */}
            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsAppReset}>
              <Ionicons name="logo-whatsapp" size={24} color="white" />
              <Text tx="forgotPassword:whatsappBtn" style={styles.whatsappBtnText} preset="bold" />
            </TouchableOpacity>

            {/* Direct Call Support Button */}
            <Button
              preset="secondary"
              style={styles.callBtn}
              onPress={handleCallSupport}
              tx="forgotPassword:callBtn"
            />
          </View>

          {/* Helper Note */}
          <View style={[styles.noteCard, { backgroundColor: colors.palette.surfaceContainerHigh || "rgba(0,0,0,0.03)" }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.palette.primary} />
            <Text tx="forgotPassword:supportNote" style={styles.noteText} size="xs" />
          </View>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  whatsappIcon: {
    textAlign: "center",
    writingDirection: "ltr",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    opacity: 0.8,
    paddingHorizontal: 8,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 4,
  },
  whatsappBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  whatsappBtnText: {
    color: "white",
    fontSize: 16,
  },
  callBtn: {
    height: 52,
    borderRadius: 26,
    marginTop: 4,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  noteText: {
    flex: 1,
    lineHeight: 18,
    opacity: 0.85,
  },
})

export default ForgotPasswordScreen
