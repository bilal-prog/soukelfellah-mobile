import React, { FC, memo, useState, useCallback, useEffect } from "react"
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "./Button"
import { Text } from "./Text"
import { TextField, TextFieldAccessoryProps } from "./TextField"
import { translate } from "@/localization/translate"
import { useAuth } from "@/context/AuthContext"
import { updateProfile } from "@/services/api/modules/auth"
import { useLocationsQuery } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface EditProfileModalProps {
  visible: boolean
  onClose: () => void
}

export const EditProfileModal: FC<EditProfileModalProps> = memo(function EditProfileModal({
  visible,
  onClose,
}) {
  const { theme } = useAppTheme()
  const colors = theme.colors
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const { userName, userPhone, userLocation, updateProfileState } = useAuth()

  const [fullName, setFullName] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedProvince, setSelectedProvince] = useState<any>(null)
  const [selectedCommune, setSelectedCommune] = useState<any>(null)
  const [address, setAddress] = useState("")

  const [isRegionModalVisible, setIsRegionModalVisible] = useState(false)
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false)
  const [isCommuneModalVisible, setIsCommuneModalVisible] = useState(false)

  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { data: dbRegions, isFetching: isFetchingRegions } = useLocationsQuery({ type: "region" })
  const { data: dbProvinces, isFetching: isFetchingProvinces } = useLocationsQuery(
    selectedRegion ? { type: "province", parentId: selectedRegion._id } : undefined,
    { enabled: !!selectedRegion },
  )
  const { data: dbCommunes, isFetching: isFetchingCommunes } = useLocationsQuery(
    selectedProvince ? { type: "commune", parentId: selectedProvince._id } : undefined,
    { enabled: !!selectedProvince },
  )

  useEffect(() => {
    if (visible) {
      setFullName(userName || "")
      setAddress(userLocation?.address || "")
      setErrorMsg("")
      if (userLocation?.region) {
        setSelectedRegion({ name: userLocation.region })
      }
      if (userLocation?.province) {
        setSelectedProvince({ name: userLocation.province })
      }
      if (userLocation?.commune) {
        setSelectedCommune({ name: userLocation.commune })
      }
    }
  }, [visible, userName, userLocation])

  const handleSubmit = useCallback(async () => {
    setErrorMsg("")

    if (!fullName.trim()) {
      setErrorMsg(translate("register:nameRequired"))
      return
    }

    const names = fullName.trim().split(" ")
    const firstName = names[0] || ""
    const lastName = names.slice(1).join(" ") || ""

    const locationData = {
      address: address.trim(),
      region: selectedRegion?.name || "",
      province: selectedProvince?.name || "",
      commune: selectedCommune?.name || undefined,
      coordinates:
        selectedCommune?.coordinates ||
        selectedProvince?.coordinates ||
        selectedRegion?.coordinates ||
        undefined,
    }

    setIsLoading(true)
    try {
      const res = await updateProfile({
        firstName,
        lastName,
        location: locationData,
      })
      setIsLoading(false)

      if (res.kind === "ok") {
        updateProfileState(fullName.trim(), undefined, locationData)
        Alert.alert(translate("addListing:successTitle"), translate("editProfile:success"))
        onClose()
      } else {
        setErrorMsg(res.error || translate("common:error"))
      }
    } catch (err: any) {
      setIsLoading(false)
      setErrorMsg(err.message || translate("common:error"))
    }
  }, [
    fullName,
    address,
    selectedRegion,
    selectedProvince,
    selectedCommune,
    updateProfileState,
    onClose,
  ])

  const renderPersonIcon = useCallback(
    (props: TextFieldAccessoryProps) => (
      <View style={props.style}>
        <Ionicons name="person-outline" size={s(20)} color={colors.palette.onSurfaceVariant} />
      </View>
    ),
    [colors],
  )

  const renderLocationIcon = useCallback(
    (props: TextFieldAccessoryProps) => (
      <View style={props.style}>
        <Ionicons name="location-outline" size={s(20)} color={colors.palette.onSurfaceVariant} />
      </View>
    ),
    [colors],
  )

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.backdropPressable} onPress={onClose} />

        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={s(22)} color={colors.palette.onSurfaceVariant} />
          </TouchableOpacity>

          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.headerIconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: colors.palette.primary + "18" }]}>
                <Ionicons name="person-outline" size={s(32)} color={colors.palette.primary} />
              </View>
            </View>

            <Text tx="editProfile:title" preset="bold" size="lg" style={styles.title} />

            <View style={styles.form}>
              <TextField
                containerStyle={styles.fieldContainer}
                labelTx="register:fullName"
                placeholder={translate("register:fullNamePlaceholder")}
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val)
                  if (errorMsg) setErrorMsg("")
                }}
                LeftAccessory={renderPersonIcon}
              />

              {/* Disabled Phone Number Field */}
              <View style={styles.fieldContainer}>
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("login:phone")}
                </Text>
                <View style={styles.disabledInputRow}>
                  <Ionicons
                    name="call-outline"
                    size={s(18)}
                    color={colors.palette.onSurfaceVariant}
                  />
                  <Text text={userPhone || ""} style={styles.disabledPhoneText} size="sm" />
                  <Ionicons
                    name="lock-closed"
                    size={s(16)}
                    color={colors.palette.error}
                    style={{ marginLeft: "auto" }}
                  />
                </View>
                <Text
                  tx="editProfile:phoneLocked"
                  size="xxs"
                  style={{
                    color: colors.palette.onSurfaceVariant,
                    marginTop: 4,
                    fontStyle: "italic",
                  }}
                />
              </View>

              {/* Region Selector */}
              <View style={styles.fieldContainer}>
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:regionLabel")}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsRegionModalVisible(true)}
                  style={styles.selectTrigger}
                >
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
                </TouchableOpacity>
              </View>

              {/* Province Selector */}
              <View style={styles.fieldContainer}>
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:provinceLabel")}
                </Text>
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
                  style={styles.selectTrigger}
                >
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
                </TouchableOpacity>
              </View>

              {/* Commune Selector */}
              <View style={styles.fieldContainer}>
                <Text size="xxs" style={styles.selectLabel}>
                  {translate("addListing:communeLabel")}
                </Text>
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
                </TouchableOpacity>
              </View>

              <TextField
                containerStyle={styles.fieldContainer}
                labelTx="addListing:addressLabel"
                placeholder={translate("addListing:addressPlaceholder")}
                value={address}
                onChangeText={setAddress}
                LeftAccessory={renderLocationIcon}
              />

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
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={
                  isLoading ||
                  !fullName.trim() ||
                  !selectedRegion ||
                  !selectedProvince ||
                  !address ||
                  !address.trim()
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text
                    tx="editProfile:submit"
                    style={styles.submitBtnText}
                    size="md"
                    preset="bold"
                  />
                )}
              </Button>
            </View>
          </ScrollView>
        </View>

        {/* Region Selection Modal */}
        <Modal visible={isRegionModalVisible} animationType="slide" transparent>
          <View style={[styles.modalOverlay]}>
            <View style={[styles.modalContent, $bottomContainerInsets]}>
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
          <View style={[styles.modalOverlay]}>
            <View style={[styles.modalContent, $bottomContainerInsets]}>
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

        {/* Commune Selection Modal */}
        <Modal visible={isCommuneModalVisible} animationType="slide" transparent>
          <View style={[styles.modalOverlay]}>
            <View style={[styles.modalContent, $bottomContainerInsets]}>
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
  selectLabel: {
    marginBottom: vs(4),
    fontWeight: "bold",
  },
  disabledInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    backgroundColor: "#f0f2f5",
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: "#e0e2e5",
  },
  disabledPhoneText: {
    fontFamily: "monospace",
    color: "#606468",
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: "#e0e2e5",
  },
  selectValueText: {
    fontSize: s(14),
    color: "#191c1d",
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
    marginTop: vs(8),
    width: "100%",
  },
  submitBtnText: {
    color: "white",
    width: "100%",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    maxHeight: "70%",
    padding: s(20),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(15),
  },
  modalItem: {
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
})

export default EditProfileModal
