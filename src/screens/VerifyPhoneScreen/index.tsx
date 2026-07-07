import React, { FC, useState, memo, useCallback, useRef } from "react"
import { View, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/localization"
import { translate } from "@/localization/translate"
import type { AppStackScreenProps } from "@/navigation/navigationTypes"
import { useVerifyOtpMutation } from "@/services/api/hooks"
import { useAppTheme } from "@/theme/context"

import { $styles } from "./styles"

interface VerifyPhoneScreenProps extends AppStackScreenProps<"VerifyPhone"> {}

export const VerifyPhoneScreen: FC<VerifyPhoneScreenProps> = memo(
  function VerifyPhoneScreen(props) {
    const { theme } = useAppTheme()
    const colors = theme.colors
    const styles = $styles(theme)
    const { navigation, route } = props
    const { phone } = route.params
    const { setAuthSession } = useAuth()

    const pin1 = useRef<TextInput>(null)
    const pin2 = useRef<TextInput>(null)
    const pin3 = useRef<TextInput>(null)
    const pin4 = useRef<TextInput>(null)
    const pin5 = useRef<TextInput>(null)
    const pin6 = useRef<TextInput>(null)

    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")
    const [code3, setCode3] = useState("")
    const [code4, setCode4] = useState("")
    const [code5, setCode5] = useState("")
    const [code6, setCode6] = useState("")

    const [focus1, setFocus1] = useState(false)
    const [focus2, setFocus2] = useState(false)
    const [focus3, setFocus3] = useState(false)
    const [focus4, setFocus4] = useState(false)
    const [focus5, setFocus5] = useState(false)
    const [focus6, setFocus6] = useState(false)

    const verifyOtpMutation = useVerifyOtpMutation()
    const isLoading = verifyOtpMutation.isPending

    const handleVerify = useCallback(() => {
      const otp = `${code1}${code2}${code3}${code4}${code5}${code6}`
      if (otp.length < 6) {
        Alert.alert(translate("common:warning"), translate("common:incompleteCode"))
        return
      }

      verifyOtpMutation.mutate(
        { phone, otp },
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
            const errMsg = error.message || translate("common:verificationFailed")
            Alert.alert(translate("common:error"), errMsg)
          },
        },
      )
    }, [code1, code2, code3, code4, code5, code6, phone, verifyOtpMutation, setAuthSession])

    const handleGoBack = useCallback(() => {
      navigation.goBack()
    }, [navigation])

    const onPinChange = (text: string, pinNumber: number) => {
      const val = text.slice(-1)
      if (pinNumber === 1) {
        setCode1(val)
        if (val) pin2.current?.focus()
      } else if (pinNumber === 2) {
        setCode2(val)
        if (val) {
          pin3.current?.focus()
        } else {
          pin1.current?.focus()
        }
      } else if (pinNumber === 3) {
        setCode3(val)
        if (val) {
          pin4.current?.focus()
        } else {
          pin2.current?.focus()
        }
      } else if (pinNumber === 4) {
        setCode4(val)
        if (val) {
          pin5.current?.focus()
        } else {
          pin3.current?.focus()
        }
      } else if (pinNumber === 5) {
        setCode5(val)
        if (val) {
          pin6.current?.focus()
        } else {
          pin4.current?.focus()
        }
      } else if (pinNumber === 6) {
        setCode6(val)
        if (!val) pin5.current?.focus()
      }
    }

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
          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="lock-closed" size={48} color={colors.palette.primary} />
            </View>
          </View>

          <Text tx="verifyPhone:title" style={styles.title} preset="heading" />
          <Text style={styles.subtitle}>
            <Text tx="verifyPhone:subtitle" />{" "}
            <Text text={phone} preset="bold" style={styles.phoneHighlight} />
          </Text>

          {/* Pin Code Slots */}
          <View style={styles.otpContainer}>
            <TextInput
              ref={pin1}
              value={code1}
              onChangeText={(t) => onPinChange(t, 1)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus1 && styles.otpInputFocused]}
              onFocus={() => setFocus1(true)}
              onBlur={() => setFocus1(false)}
              maxLength={1}
            />
            <TextInput
              ref={pin2}
              value={code2}
              onChangeText={(t) => onPinChange(t, 2)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus2 && styles.otpInputFocused]}
              onFocus={() => setFocus2(true)}
              onBlur={() => setFocus2(false)}
              maxLength={1}
            />
            <TextInput
              ref={pin3}
              value={code3}
              onChangeText={(t) => onPinChange(t, 3)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus3 && styles.otpInputFocused]}
              onFocus={() => setFocus3(true)}
              onBlur={() => setFocus3(false)}
              maxLength={1}
            />
            <TextInput
              ref={pin4}
              value={code4}
              onChangeText={(t) => onPinChange(t, 4)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus4 && styles.otpInputFocused]}
              onFocus={() => setFocus4(true)}
              onBlur={() => setFocus4(false)}
              maxLength={1}
            />
            <TextInput
              ref={pin5}
              value={code5}
              onChangeText={(t) => onPinChange(t, 5)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus5 && styles.otpInputFocused]}
              onFocus={() => setFocus5(true)}
              onBlur={() => setFocus5(false)}
              maxLength={1}
            />
            <TextInput
              ref={pin6}
              value={code6}
              onChangeText={(t) => onPinChange(t, 6)}
              keyboardType="number-pad"
              style={[styles.otpInput, focus6 && styles.otpInputFocused]}
              onFocus={() => setFocus6(true)}
              onBlur={() => setFocus6(false)}
              maxLength={1}
            />
          </View>

          {/* Actions */}
          <Button
            preset="primary"
            style={styles.confirmBtn}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text tx="verifyPhone:submit" style={styles.confirmBtnText} />
            )}
          </Button>

          <TouchableOpacity style={styles.resendBtn}>
            <Text tx="verifyPhone:resend" style={styles.resendText} size="xs" />
          </TouchableOpacity>
        </View>
      </Screen>
    )
  },
)

export default VerifyPhoneScreen
