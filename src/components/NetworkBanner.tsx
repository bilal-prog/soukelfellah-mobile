import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNetInfo } from "@react-native-community/netinfo"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "./Text"
import { useAppTheme } from "@/theme/context"

import { s, vs } from "@/utils/scaling"

export function NetworkBanner() {
  const netInfo = useNetInfo()
  const insets = useSafeAreaInsets()
  const { theme } = useAppTheme()
  const colors = theme.colors

  const [wasOffline, setWasOffline] = useState(false)
  const [showRestored, setShowRestored] = useState(false)

  const translateY = useRef(new Animated.Value(-100)).current

  const isOffline =
    netInfo.isConnected === false || (netInfo.isInternetReachable === false && netInfo.isConnected !== null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    if (isOffline) {
      setWasOffline(true)
      setShowRestored(false)
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else if (wasOffline) {
      // Transitioning back online
      setShowRestored(true)
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()

      timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowRestored(false)
          setWasOffline(false)
        })
      }, 3000)
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isOffline, wasOffline, translateY])

  if (!isOffline && !showRestored) {
    return null
  }

  const backgroundColor = isOffline ? colors.palette.error || "#D32F2F" : "#2E7D32"
  const iconName = isOffline ? "cloud-offline-outline" : "wifi-outline"
  const textTx = isOffline ? "network:noConnection" : "network:restored"

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, vs(8)) + vs(4),
          backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={iconName}
          size={s(18)}
          color="white"
          style={styles.icon}
        />
        <Text
          tx={textTx}
          style={styles.text}
          size="xs"
          preset="bold"
        />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    elevation: 10,
    paddingBottom: vs(8),
    paddingHorizontal: s(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
  },
  icon: {
    textAlign: "center",
    writingDirection: "ltr",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
})
