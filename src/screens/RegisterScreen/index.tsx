import React, { FC, useState, memo, useCallback } from "react"
import { View, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useRegisterMutation, useLocationsQuery } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { CallIcon } from "./components/CallIcon"
import { LocationIcon } from "./components/LocationIcon"
import { LockIcon } from "./components/LockIcon"
import { PersonIcon } from "./components/PersonIcon"
import { $styles } from "./styles"
import { s } from "@/utils/scaling"

interface RegisterScreenProps extends AppStackScreenProps<"Register"> {}

export const RegisterScreen: FC<RegisterScreenProps> = memo(function RegisterScreen(props) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const styles = $styles(theme)
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { navigation } = props
  const { setAuthSession } = useAuth()

  const registerMutation = useRegisterMutation()
  const isLoading = registerMutation.isPending

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedProvince, setSelectedProvince] = useState<any>(null)
  const [selectedCommune, setSelectedCommune] = useState<any>(null)
  const [address, setAddress] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false)
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)
  const [isCommuneModalVisible, setIsCommuneModalVisible] = useState(false)

  const [nameError, setNameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [regionError, setRegionError] = useState("")
  const [provinceError, setProvinceError] = useState("")
  const [addressError, setAddressError] = useState("")

  const { data: dbRegions, isFetching: isFetchingRegions } = useLocationsQuery({ type: "region" })
  const { data: dbProvinces, isFetching: isFetchingProvinces } = useLocationsQuery(
    selectedRegion ? { type: "province", parentId: selectedRegion._id } : undefined,
    { enabled: !!selectedRegion },
  )
  const { data: dbCommunes, isFetching: isFetchingCommunes } = useLocationsQuery(
    selectedProvince ? { type: "commune", parentId: selectedProvince._id } : undefined,
    { enabled: !!selectedProvince },
  )

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

    if (!selectedRegion) {
      setRegionError(translate("register:regionRequired"))
      isValid = false
    } else {
      setRegionError("")
    }

    if (!selectedProvince) {
      setProvinceError(translate("register:provinceRequired"))
      isValid = false
    } else {
      setProvinceError("")
    }

    if (!address) {
      setAddressError(translate("register:addressRequired"))
      isValid = false
    } else {
      setAddressError("")
    }

    return isValid
  }, [fullName, phone, password, selectedRegion, selectedProvince, address])

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
        region: selectedRegion?.name || "",
        province: selectedProvince?.name || "",
        commune: selectedCommune?.name || undefined,
      },
    }

    registerMutation.mutate(registrationParams, {
      onSuccess: (data) => {
        setAuthSession(data.accessToken, data.refreshToken, {
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          phone: data.user.phone,
          role: data.user.role,
          location: data.user.location || registrationParams.location,
        })
      },
      onError: (error: any) => {
        const errMsg = error.message || translate("register:registerFailedMsg")
        Alert.alert(translate("register:registerFailedTitle"), errMsg)
      },
    })
  }, [
    validate,
    fullName,
    phone,
    password,
    address,
    selectedRegion,
    selectedProvince,
    selectedCommune,
    registerMutation,
    setAuthSession,
  ])

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
        <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={s(24)} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header Block */}
        <View style={styles.headerSection}>
          <Text tx="register:title" style={styles.title} size="xxl" preset="heading" />
          <Text tx="welcome:subtitle" style={styles.subtitle} size="sm" />
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
                    size={s(20)}
                    color={colors.palette.onSurfaceVariant}
                  />
                </TouchableOpacity>
              ),
              [isPasswordVisible, togglePasswordVisibility],
            )}
            containerStyle={styles.inputGroup}
          />

          {/* Region Selector */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              onPress={() => setIsRegionModalVisible(true)}
              style={[
                styles.selectTrigger,
                regionError ? { borderColor: colors.palette.error } : undefined,
              ]}
            >
              <Text size="xxs" style={styles.selectLabel}>
                {translate("addListing:regionLabel")}
              </Text>
              <View style={styles.selectContent}>
                <Text
                  text={
                    selectedRegion
                      ? selectedRegion.name
                      : translate("addListing:selectRegionPlaceholder")
                  }
                  style={styles.selectValueText}
                />
                <Ionicons
                  name="chevron-down"
                  size={s(20)}
                  color={colors.palette.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
            {regionError ? (
              <Text
                text={regionError}
                size="xxs"
                style={{ color: colors.palette.error, marginTop: 4 }}
              />
            ) : null}
          </View>

          {/* Province Selector */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              onPress={() => {
                if (!selectedRegion) {
                  Alert.alert(
                    translate("addListing:regionWarningTitle"),
                    translate("addListing:regionWarningMsg"),
                  )
                  return
                }
                setIsProvinceModalVisible(true)
              }}
              style={[
                styles.selectTrigger,
                provinceError ? { borderColor: colors.palette.error } : undefined,
              ]}
            >
              <Text size="xxs" style={styles.selectLabel}>
                {translate("addListing:provinceLabel")}
              </Text>
              <View style={styles.selectContent}>
                <Text
                  text={
                    selectedProvince
                      ? selectedProvince.name
                      : translate("addListing:selectProvincePlaceholder")
                  }
                  style={styles.selectValueText}
                />
                <Ionicons
                  name="chevron-down"
                  size={s(20)}
                  color={colors.palette.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
            {provinceError ? (
              <Text
                text={provinceError}
                size="xxs"
                style={{ color: colors.palette.error, marginTop: 4 }}
              />
            ) : null}
          </View>

          {/* Commune Selector (Optional) */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              onPress={() => {
                if (!selectedProvince) {
                  Alert.alert(
                    translate("addListing:communeWarningTitle"),
                    translate("addListing:communeWarningMsg"),
                  )
                  return
                }
                setIsCommuneModalVisible(true)
              }}
              style={styles.selectTrigger}
            >
              <Text size="xxs" style={styles.selectLabel}>
                {translate("addListing:communeLabel")}
              </Text>
              <View style={styles.selectContent}>
                <Text
                  text={
                    selectedCommune
                      ? selectedCommune.name
                      : translate("addListing:selectCommunePlaceholder")
                  }
                  style={styles.selectValueText}
                />
                <Ionicons
                  name="chevron-down"
                  size={s(20)}
                  color={colors.palette.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
          </View>

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
            <Text style={styles.legalDisclaimerText} size="xxs">
              <Text
                tx="legal:registerAcceptancePrefix"
                style={styles.legalDisclaimerText}
                size="xxs"
              />
              <Text
                tx="legal:termsLink"
                style={styles.legalLink}
                size="xxs"
                onPress={() => navigation.navigate("Legal", { type: "cgu" })}
              />
              <Text tx="legal:and" style={styles.legalDisclaimerText} size="xxs" />
              <Text
                tx="legal:privacyLink"
                style={styles.legalLink}
                size="xxs"
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
              <Text tx="register:submit" style={styles.registerBtnText} size="md" />
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

      {/* Region Selection Modal */}
      <Modal visible={isRegionModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text tx="addListing:selectRegionPlaceholder" preset="bold" size="sm" />
              <TouchableOpacity onPress={() => setIsRegionModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingRegions ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={dbRegions || []}
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedRegion(item)
                      setSelectedProvince(null)
                      setSelectedCommune(null)
                      setIsRegionModalVisible(false)
                      if (regionError) setRegionError("")
                    }}
                  >
                    <Text text={item.name} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Province Selection Modal */}
      <Modal visible={isProvinceModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectProvincePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsProvinceModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingProvinces ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={dbProvinces || []}
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedProvince(item)
                      setSelectedCommune(null)
                      setIsProvinceModalVisible(false)
                      if (provinceError) setProvinceError("")
                    }}
                  >
                    <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Commune Selection Modal (Optional) */}
      <Modal visible={isCommuneModalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, $bottomContainerInsets]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text
                tx="addListing:selectCommunePlaceholder"
                preset="bold"
                size="sm"
                style={{ textAlign: "left", flex: 1 }}
              />
              <TouchableOpacity onPress={() => setIsCommuneModalVisible(false)}>
                <Ionicons name="close" size={s(24)} color={colors.text} />
              </TouchableOpacity>
            </View>
            {isFetchingCommunes ? (
              <ActivityIndicator
                size="small"
                color={colors.palette.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <FlatList
                data={[{ _id: "none", name: translate("common:none") }, ...(dbCommunes || [])]}
                keyExtractor={(item: any) => item?._id}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      if (item._id === "none") {
                        setSelectedCommune(null)
                      } else {
                        setSelectedCommune(item)
                      }
                      setIsCommuneModalVisible(false)
                    }}
                  >
                    <Text text={item.name} style={{ textAlign: "left", width: "100%" }} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

export default RegisterScreen
