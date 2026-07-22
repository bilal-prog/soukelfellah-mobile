import React, { FC, useState, memo, useCallback } from "react"
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useRegisterMutation } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"

import { CallIcon } from "./components/CallIcon"
import { LocationIcon } from "./components/LocationIcon"
import { LockIcon } from "./components/LockIcon"
import { PersonIcon } from "./components/PersonIcon"
import { $styles } from "./styles"

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = memo(function RegisterScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const { navigation } = props
  const { setAuthSession } = useAuth()

  const registerMutation = useRegisterMutation()
  const isLoading = registerMutation.isPending

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [nameError, setNameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [addressError, setAddressError] = useState("")

  const validate = useCallback(() => {
    let isValid = true
    if (!fullName) {
      setNameError(translate("register:nameRequired"))
      isValid = false
    } else {
      setNameError("")
    }

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

    if (!address) {
      setAddressError(translate("register:addressRequired"))
      isValid = false
    } else {
      setAddressError("")
    }

    return isValid
  }, [fullName, phone, password, address])

  const handleRegister = useCallback(() => {
    if (!validate()) return

    const names = fullName.trim().split(" ")
    const firstName = names[0] || ""
    const lastName = names.slice(1).join(" ") || translate("common:farmer")

    const registrationParams = {
      firstName,
      lastName,
      phone: phone.trim(),
      password,
      whatsappNumber: phone.trim(),
      location: {
        address: address.trim(),
        region: "Casablanca-Settat",
        province: "Sidi Bennour",
      },
    }

    registerMutation.mutate(registrationParams, {
      onSuccess: (data) => {
        setAuthSession(data.accessToken, data.refreshToken, {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          phone: data.user.phone,
          role: data.user.role,
        })
      },
      onError: (error: any) => {
        const errMsg = error.message || translate("register:registerFailedMsg")
        Alert.alert(translate("register:registerFailedTitle"), errMsg)
      },
    })
  }, [validate, fullName, phone, password, address, registerMutation, setAuthSession])

  const handleGoBack = useCallback(() => {
    navigation.navigate("Welcome")
  }, [navigation])

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev)
  }, [])

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={styles.container}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header Block */}
        <View style={styles.headerSection}>
          <Text tx="register:title" style={styles.title} preset="heading" />
          <Text tx="welcome:subtitle" style={styles.subtitle} />
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <TextField
            value={fullName}
            onChangeText={(val) => {
              setFullName(val)
              if (nameError) setNameError("")
            }}
            placeholder={translate("register:fullNamePlaceholder")}
            autoCapitalize="words"
            autoCorrect={false}
            labelTx="register:fullName"
            helper={nameError}
            status={nameError ? "error" : undefined}
            LeftAccessory={PersonIcon}
            containerStyle={styles.inputGroup}
          />

          <TextField
            value={phone}
            onChangeText={(val) => {
              setPhone(val)
              if (phoneError) setPhoneError("")
            }}
            placeholder="06XXXXXXXX"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            labelTx="register:phone"
            helper={phoneError}
            status={phoneError ? "error" : undefined}
            LeftAccessory={CallIcon}
            containerStyle={styles.inputGroup}
          />

          <TextField
            value={password}
            onChangeText={(val) => {
              setPassword(val)
              if (passwordError) setPasswordError("")
            }}
            placeholder="••••••••"
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            labelTx="register:password"
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

          <TextField
            value={address}
            onChangeText={(val) => {
              setAddress(val)
              if (addressError) setAddressError("")
            }}
            placeholder={translate("addListing:addressPlaceholder")}
            labelTx="addListing:addressLabel"
            helper={addressError}
            status={addressError ? "error" : undefined}
            LeftAccessory={LocationIcon}
            containerStyle={styles.inputGroup}
          />

          {/* Legal Acceptance Disclaimer */}
          <View style={styles.legalDisclaimerContainer}>
            <Text style={styles.legalDisclaimerText} size="xs">
              <Text tx="legal:registerAcceptancePrefix" style={styles.legalDisclaimerText} size="xs" />
              <Text
                tx="legal:termsLink"
                style={styles.legalLink}
                size="xs"
                onPress={() => navigation.navigate("Legal", { type: "cgu" })}
              />
              <Text tx="legal:and" style={styles.legalDisclaimerText} size="xs" />
              <Text
                tx="legal:privacyLink"
                style={styles.legalLink}
                size="xs"
                onPress={() => navigation.navigate("Legal", { type: "privacy" })}
              />
              .
            </Text>
          </View>

          {/* Submit Action */}
          <Button

            preset="primary"
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text tx="register:submit" style={styles.registerBtnText} />
            )}
          </Button>
        </View>

        {/* Redirect CTA */}
        <View style={styles.footer}>
          <Text tx="register:hasAccount" style={styles.footerText} size="xs" />
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginLinkWrapper}
          >
            <Text tx="register:loginNow" style={styles.loginLink} size="xs" />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

export default RegisterScreen
