import React, { FC } from "react"
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { useAuth } from "@/context/AuthContext"
import { TxKeyPath } from "@/localization"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

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
          <Ionicons name={icon} size={s(64)} color={colors.palette.primary} />
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
    height: vs(56),
    borderRadius: s(28),
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  btnText: {
    color: "white",
    fontSize: fontSizes.fs16,
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
    paddingHorizontal: s(24),
  } as ViewStyle,
  description: {
    textAlign: "center",
    lineHeight: vs(22),
    marginBottom: vs(32),
  } as TextStyle,
  iconCircle: {
    width: s(120),
    height: vs(120),
    borderRadius: s(60),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(24),
  } as ViewStyle,
  title: {
    marginBottom: vs(12),
    textAlign: "center",
  } as TextStyle,
})
