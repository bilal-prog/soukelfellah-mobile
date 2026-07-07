import React, { FC, useState, memo, useCallback } from "react"
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useLoginMutation } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { CallIcon } from "./components/CallIcon"
import { LockIcon } from "./components/LockIcon"
import { $styles } from "./styles"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = memo(function LoginScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props
  const { setAuthSession } = useAuth()

  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [phoneError, setPhoneError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validate = useCallback(() => {
    let isValid = true
    if (!phone) {
      setPhoneError(translate("login:phoneRequired"))
      isValid = false
    } else if (phone.length < 10) {
      setPhoneError(translate("login:phoneInvalid"))
      isValid = false
    } else {
      setPhoneError("")
    }

    if (!password) {
      setPasswordError(translate("login:passwordRequired"))
      isValid = false
    } else if (password.length < 6) {
      setPasswordError(translate("login:passwordMinLength"))
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }, [phone, password])

  const loginMutation = useLoginMutation()
  const isLoading = loginMutation.isPending

  const handleLogin = useCallback(() => {
    if (!validate()) return

    loginMutation.mutate(
      { phone: phone.trim(), password },
      {
        onSuccess: (data) => {
          if (!data) return
          const { accessToken, refreshToken, user } = data
          setAuthSession(accessToken, refreshToken, {
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || translate("common:farmer"),
            phone: user.phone,
            role: user.role,
          })
        },
        onError: (error: any) => {
          const errMsg = error.message || translate("login:loginFailedMsg")
          Alert.alert(translate("login:loginFailedTitle"), errMsg)
        },
      },
    )
  }, [validate, loginMutation, phone, password, setAuthSession])

  const handleGoBack = useCallback(() => {
    navigation.navigate("Welcome")
  }, [navigation])

  const handlePhoneChange = useCallback(
    (val: string) => {
      setPhone(val)
      if (phoneError) setPhoneError("")
    },
    [phoneError],
  )

  const handlePasswordChange = useCallback(
    (val: string) => {
      setPassword(val)
      if (passwordError) setPasswordError("")
    },
    [passwordError],
  )

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev)
  }, [])

  const handleRegister = useCallback(() => {
    navigation.navigate("Register")
  }, [navigation])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header Block */}
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={40} color={colors.palette.onPrimaryContainer} />
          </View>
          <Text tx="login:title" style={styles.title} preset="heading" />
          <Text tx="welcome:subtitle" style={styles.subtitle} />
        </View>

        {/* Inputs Form */}
        <View style={styles.form}>
          <TextField
            value={phone}
            onChangeText={handlePhoneChange}
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

          <View style={{ gap: 8 }}>
            <TextField
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="••••••••"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              labelTx="login:password"
              helper={passwordError}
              status={passwordError ? "error" : undefined}
              LeftAccessory={LockIcon}
              RightAccessory={useCallback(
                (iconProps: any) => (
                  <TouchableOpacity onPress={togglePasswordVisibility} style={iconProps.style}>
                    <Ionicons
                      name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.palette.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                ),
                [isPasswordVisible, togglePasswordVisibility],
              )}
              containerStyle={styles.inputGroup}
            />

            <View style={styles.forgotRow}>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  tx="login:forgotPassword"
                  style={styles.forgotPassword}
                  size="xxs"
                  preset="bold"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Action */}
          <Button
            preset="primary"
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text tx="login:submit" style={styles.loginBtnText} />
            )}
          </Button>
        </View>

        {/* Redirect CTA */}
        <View style={styles.footer}>
          <Text tx="login:noAccount" style={styles.footerText} size="xs" />
          <TouchableOpacity onPress={handleRegister} style={styles.signUpLinkWrapper}>
            <Text tx="login:registerNow" style={styles.signUpLink} size="xs" />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

export default LoginScreen
