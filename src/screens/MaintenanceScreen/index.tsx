import React, { FC, memo } from "react"
import { View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { fontSizes } from "@/theme/fontSizes"
import { useAppTheme } from "@/theme/context"
import { s, vs } from "@/utils/scaling"

interface MaintenanceScreenProps {
  onRetry?: () => void
  isChecking?: boolean
}

export const MaintenanceScreen: FC<MaintenanceScreenProps> = memo(
  function MaintenanceScreen({ onRetry, isChecking }) {
    const { theme } = useAppTheme()

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          {/* Main Info */}
          <View style={styles.mainInfo}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.colors.palette.primary + "15" },
              ]}
            >
              <Ionicons
                name="construct-outline"
                size={72}
                color={theme.colors.palette.primary}
                style={styles.iconStyle}
              />

            </View>

            <Text tx="version:maintenanceTitle" preset="bold" style={styles.title} />
            <Text tx="version:maintenanceMessage" style={styles.message} />
          </View>

          {/* Bottom Action */}
          {onRetry && (
            <View style={styles.actionContainer}>
              <Button
                preset="primary"
                style={[
                  styles.retryBtn,
                  { backgroundColor: theme.colors.palette.primary },
                ]}
                onPress={onRetry}
                disabled={isChecking}
                tx="common:retry"
              />
            </View>
          )}
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: s(24),
    paddingVertical: vs(24),
  },
  mainInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconCircle: {
    width: s(130),
    height: vs(130),
    borderRadius: s(65),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(28),
  },
  iconStyle: {
    textAlign: "center",
    writingDirection: "ltr",
  },

  title: {
    fontSize: fontSizes.fs24,
    textAlign: "center",
    marginBottom: vs(12),
  },
  message: {
    fontSize: fontSizes.fs15,
    textAlign: "center",
    lineHeight: vs(22),
    opacity: 0.8,
    paddingHorizontal: s(12),
  },
  actionContainer: {
    width: "100%",
    paddingTop: vs(16),
  },
  retryBtn: {
    width: "100%",
    height: vs(52),
    borderRadius: s(26),
  },
})

export default MaintenanceScreen

