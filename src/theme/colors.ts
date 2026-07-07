export const palette = {
  primary: "#0f5238",
  onPrimary: "#ffffff",
  primaryContainer: "#2d6a4f",
  onPrimaryContainer: "#a8e7c5",
  inversePrimary: "#95d4b3",

  secondary: "#80552c",
  onSecondary: "#ffffff",
  secondaryContainer: "#fec391",
  onSecondaryContainer: "#794e26",

  tertiary: "#713638",
  onTertiary: "#ffffff",
  tertiaryContainer: "#8d4d4e",
  onTertiaryContainer: "#ffcfce",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorsContainer: "#93000a",

  background: "#f8f9fa",
  onBackground: "#191c1d",

  surface: "#f8f9fa",
  surfaceDim: "#d9dadb",
  surfaceBright: "#f8f9fa",
  surfaceVariant: "#e1e3e4",
  onSurface: "#191c1d",
  onSurfaceVariant: "#404943",
  inverseSurface: "#2e3132",
  inverseOnSurface: "#f0f1f2",

  outline: "#707973",
  outlineVariant: "#bfc9c1",
  surfaceTint: "#2c694e",

  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f4f5",
  surfaceContainer: "#edeeef",
  surfaceContainerHigh: "#e7e8e9",
  surfaceContainerHighest: "#e1e3e4",

  // Fixed colors
  primaryFixed: "#b1f0ce",
  primaryFixedDim: "#95d4b3",
  onPrimaryFixed: "#002114",
  onPrimaryFixedVariant: "#0e5138",
  secondaryFixed: "#ffdcc1",
  secondaryFixedDim: "#f5bb89",
  onSecondaryFixed: "#2e1600",
  onSecondaryFixedVariant: "#653e17",
  tertiaryFixed: "#ffdad9",
  tertiaryFixedDim: "#ffb3b3",
  onTertiaryFixed: "#390b0e",
  onTertiaryFixedVariant: "#6f3537",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.onSurface,
  textDim: palette.onSurfaceVariant,
  background: palette.background,
  border: palette.outlineVariant,
  tint: palette.primary,
  tintInactive: palette.onSurfaceVariant,
  separator: palette.surfaceContainer,
  error: palette.error,
  errorBackground: palette.errorContainer,
} as const
