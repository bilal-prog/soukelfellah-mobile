import React, { useEffect, useRef } from "react"
import { Animated, ViewStyle, DimensionValue } from "react-native"
import { useAppTheme } from "@/theme/context"

export interface SkeletonProps {
  width?: DimensionValue
  height?: DimensionValue
  borderRadius?: number
  style?: ViewStyle
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const { theme } = useAppTheme()
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    )
    animation.start()

    return () => animation.stop()
  }, [opacity])

  const backgroundColor =
    theme.colors.palette.surfaceContainerHigh || theme.colors.palette.outlineVariant || "#E5E7EB"

  return (
    <Animated.View
      style={[
        {
          width: width !== undefined ? width : "100%",
          height: height !== undefined ? height : 20,
          borderRadius,
          backgroundColor,
          opacity,
        },
        style,
      ]}
    />
  )
}
