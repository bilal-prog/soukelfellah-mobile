import { ViewStyle, TextStyle } from "react-native"

import { fontSizes } from "../../theme/fontSizes"
import type { Theme } from "../../theme/types"
import { s, vs } from "../../utils/scaling"

export const $styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: vs(12),
    backgroundColor: theme.isDark ? theme.colors.palette.surfaceContainer : theme.colors.palette.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.separator,
    paddingHorizontal: s(24),
    paddingVertical: vs(16),
  } as ViewStyle,

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  backButton: {
    marginRight: s(16),
  } as ViewStyle,

  headerTitle: {
    fontSize: fontSizes.fs24,
    fontWeight: "800",
    color: theme.colors.text,
  } as TextStyle,

  headerAction: {
    fontSize: fontSizes.fs14,
    fontWeight: "600",
    color: theme.colors.tint,
  } as TextStyle,

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: s(24),
  } as ViewStyle,

  emptyText: {
    marginTop: vs(16),
    fontSize: fontSizes.fs18,
    fontWeight: "700",
    color: theme.colors.textDim,
  } as TextStyle,

  emptySubText: {
    marginTop: vs(8),
    fontSize: fontSizes.fs14,
    color: theme.colors.textDim,
    textAlign: "center",
    lineHeight: vs(20),
    opacity: 0.7,
  } as TextStyle,

  listContent: {
    paddingVertical: vs(8),
  } as ViewStyle,

  notificationCard: {
    flexDirection: "row",
    paddingHorizontal: s(24),
    paddingVertical: vs(16),
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.separator,
  } as ViewStyle,

  notificationCardUnread: {
    backgroundColor: theme.isDark ? "rgba(15, 82, 56, 0.1)" : "rgba(15, 82, 56, 0.05)",
  } as ViewStyle,

  iconContainer: {
    width: s(48),
    height: vs(48),
    borderRadius: s(24),
    backgroundColor: theme.colors.separator,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(16),
  } as ViewStyle,

  iconContainerUnread: {
    backgroundColor: theme.isDark ? "rgba(15, 82, 56, 0.3)" : "rgba(15, 82, 56, 0.15)",
  } as ViewStyle,

  contentContainer: {
    flex: 1,
    justifyContent: "center",
  } as ViewStyle,

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(4),
  } as ViewStyle,

  title: {
    flex: 1,
    fontSize: fontSizes.fs16,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: s(8),
  } as TextStyle,

  titleUnread: {
    fontWeight: "800",
  } as TextStyle,

  unreadDot: {
    width: s(8),
    height: vs(8),
    borderRadius: s(4),
    backgroundColor: theme.colors.error,
  } as ViewStyle,

  message: {
    fontSize: fontSizes.fs14,
    color: theme.colors.textDim,
    lineHeight: vs(20),
    marginBottom: vs(6),
  } as TextStyle,

  messageUnread: {
    color: theme.colors.text,
    fontWeight: "500",
  } as TextStyle,

  time: {
    fontSize: fontSizes.fs12,
    color: theme.colors.textDim,
    opacity: 0.6,
  } as TextStyle,
})
