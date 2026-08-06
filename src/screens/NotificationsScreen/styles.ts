import { ViewStyle, TextStyle, ImageStyle } from "react-native"

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
    backgroundColor: theme.colors.palette.surface,
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
    fontWeight: "800",
    color: theme.colors.text,
  } as TextStyle,

  headerAction: {
    fontWeight: "600",
    color: theme.colors.tint,
  } as TextStyle,

  loadingContainer: {
    width: "100%",
  } as ViewStyle,

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: s(24),
  } as ViewStyle,

  emptyText: {
    marginTop: vs(16),
    fontWeight: "700",
    color: theme.colors.textDim,
  } as TextStyle,

  emptySubText: {
    marginTop: vs(8),
    color: theme.colors.textDim,
    textAlign: "center",
    opacity: 0.7,
  } as TextStyle,

  listContent: {
    paddingVertical: vs(8),
  } as ViewStyle,

  notificationCard: {
    flexDirection: "row",
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.separator,
    alignItems: "center",
  } as ViewStyle,

  notificationCardUnread: {
    backgroundColor: theme.isDark ? "rgba(15, 82, 56, 0.1)" : "rgba(15, 82, 56, 0.05)",
  } as ViewStyle,

  iconContainer: {
    width: vs(48),
    height: vs(48),
    borderRadius: s(100),
    backgroundColor: theme.colors.separator,
    justifyContent: "center",
    alignItems: "center",
    marginRight: s(14),
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
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: s(8),
  } as TextStyle,

  titleUnread: {
    fontWeight: "800",
  } as TextStyle,

  unreadDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(100),
    backgroundColor: theme.colors.error,
  } as ViewStyle,

  message: {
    color: theme.colors.textDim,
    lineHeight: vs(20),
    marginBottom: vs(6),
  } as TextStyle,

  messageUnread: {
    color: theme.colors.text,
    fontWeight: "500",
  } as TextStyle,

  time: {
    color: theme.colors.textDim,
    opacity: 0.6,
  } as TextStyle,

  thumbnailImage: {
    width: s(54),
    height: s(54),
    borderRadius: s(8),
    marginLeft: s(12),
    backgroundColor: theme.colors.separator,
    borderWidth: 1,
    borderColor: theme.colors.separator,
  } as ImageStyle,
})
