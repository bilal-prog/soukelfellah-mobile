import React, { FC, memo, useCallback } from "react"
import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { $styles } from "./styles"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = memo(function WelcomeScreen(props) {
  const { theme } = useAppTheme()
  const styles = $styles(theme)
  const { navigation } = props
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const handleRegister = useCallback(() => {
    navigation.navigate("Register")
  }, [navigation])

  const handleLogin = useCallback(() => {
    navigation.navigate("Login")
  }, [navigation])

  const { setGuestMode } = useAuth()
  const handleGuest = useCallback(() => {
    setGuestMode(true)
  }, [setGuestMode])

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={styles.container}>
      {/* Header Logo */}
      <View style={styles.header}>
        <Ionicons name="leaf" size={32} color={theme.colors.palette.primary} />
        <Text tx="home:title" style={styles.logoText} preset="bold" />
      </View>

      {/* Hero Visual Box */}
      <View style={styles.heroContainer}>
        <View style={styles.heroCircle}>
          <Ionicons name="leaf" size={72} color={theme.colors.palette.primary} />
        </View>
      </View>

      {/* Intro Copy */}
      <View style={styles.introSection}>
        <Text tx="welcome:title" style={styles.title} preset="display" />
        <Text tx="welcome:subtitle" style={styles.subtitle} />
      </View>

      {/* CTAs */}
      <View style={styles.actionContainer}>
        <Button
          preset="primary"
          style={styles.btnPrimary}
          textStyle={styles.btnTextPrimary}
          onPress={handleRegister}
          tx="welcome:getStarted"
        />

        <Button
          preset="secondary"
          style={styles.btnSecondary}
          textStyle={styles.btnTextSecondary}
          onPress={handleLogin}
          tx="welcome:login"
        />

        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text tx="guest:continueAsGuest" style={styles.guestButtonText} />
        </TouchableOpacity>
      </View>

      <View style={$bottomContainerInsets} />
    </Screen>
  )
})

export default WelcomeScreen
