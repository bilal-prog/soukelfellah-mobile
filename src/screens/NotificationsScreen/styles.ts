import { ViewStyle, TextStyle } from "react-native"
import type { Theme } from "../../theme/types"

export const $styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    backgroundColor: theme.isDark ? theme.colors.palette.surfaceContainer : theme.colors.palette.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.separator,
    paddingHorizontal: 24,
    paddingVertical: 16,
  } as ViewStyle,

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  backButton: {
    marginRight: 16,
  } as ViewStyle,

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  } as TextStyle,

  headerAction: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.tint,
  } as TextStyle,

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  } as ViewStyle,

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textDim,
  } as TextStyle,

  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textDim,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.7,
  } as TextStyle,

  listContent: {
    paddingVertical: 8,
  } as ViewStyle,

  notificationCard: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.separator,
  } as ViewStyle,

  notificationCardUnread: {
    backgroundColor: theme.isDark ? "rgba(15, 82, 56, 0.1)" : "rgba(15, 82, 56, 0.05)",
  } as ViewStyle,

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.separator,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
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
    marginBottom: 4,
  } as ViewStyle,

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: 8,
  } as TextStyle,

  titleUnread: {
    fontWeight: "800",
  } as TextStyle,

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  } as ViewStyle,

  message: {
    fontSize: 14,
    color: theme.colors.textDim,
    lineHeight: 20,
    marginBottom: 6,
  } as TextStyle,

  messageUnread: {
    color: theme.colors.text,
    fontWeight: "500",
  } as TextStyle,

  time: {
    fontSize: 12,
    color: theme.colors.textDim,
    opacity: 0.6,
  } as TextStyle,
})
