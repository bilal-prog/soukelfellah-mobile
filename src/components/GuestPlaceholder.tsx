import React, { FC } from "react"
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/localization"
import { useAppTheme } from "@/theme/context"

import { Button } from "./Button"
import { Screen } from "./Screen"
import { Text } from "./Text"

interface GuestPlaceholderProps {
  icon: keyof typeof Ionicons.glyphMap
  titleTx: TxKeyPath
  descriptionTx: TxKeyPath
}

export const GuestPlaceholder: FC<GuestPlaceholderProps> = ({ icon, titleTx, descriptionTx }) => {
  const { theme } = useAppTheme()
  const { setGuestMode } = useAuth()
  const colors = theme.colors

  const handleLoginRedirect = () => {
    setGuestMode(false)
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={styles.container}
      style={{ backgroundColor: colors.background }}
    >
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.palette.primaryContainer }]}>
          <Ionicons name={icon} size={64} color={colors.palette.primary} />
        </View>

        <Text tx={titleTx} preset="bold" size="lg" style={[styles.title, { color: colors.text }]} />
        <Text
          tx={descriptionTx}
          size="sm"
          style={[styles.description, { color: colors.palette.onSurfaceVariant }]}
        />

        <Button
          preset="primary"
          style={[styles.btn, { backgroundColor: colors.palette.primary }]}
          onPress={handleLoginRedirect}
        >
          <Text tx="guest:loginRegisterCta" style={styles.btnText} />
        </Button>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  } as TextStyle,
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  content: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
  } as ViewStyle,
  description: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  } as TextStyle,
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  } as ViewStyle,
  title: {
    marginBottom: 12,
    textAlign: "center",
  } as TextStyle,
})
