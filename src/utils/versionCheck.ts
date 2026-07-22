import { Platform } from "react-native"
import * as Application from "expo-application"
import Constants from "expo-constants"
import DeviceInfo from "react-native-device-info"

import { AppVersion } from "@/services/api/modules/appVersions"

export interface CurrentAppInfo {
  version: string
  buildNumber: number
  platform: "ios" | "android"
}

export interface VersionEvaluationResult {
  isMaintenance: boolean
  isForceUpdate: boolean
  isOptionalUpdate: boolean
  latestVersion?: AppVersion
}

/**
 * Compare two semantic version strings (e.g. "1.0.0" vs "1.1.0").
 * Returns -1 if v1 < v2, 1 if v1 > v2, 0 if equal.
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map((p) => parseInt(p, 10) || 0)
  const parts2 = v2.split(".").map((p) => parseInt(p, 10) || 0)
  const maxLen = Math.max(parts1.length, parts2.length)

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] ?? 0
    const num2 = parts2[i] ?? 0
    if (num1 < num2) return -1
    if (num1 > num2) return 1
  }

  return 0
}

/**
 * Checks if the current version & build number is lower than target version & build number.
 */
export function isVersionOutdated(
  currentVer: string,
  currentBuild: number,
  targetVer: string,
  targetBuild: number,
): boolean {
  const comp = compareVersions(currentVer, targetVer)
  if (comp < 0) return true
  if (comp > 0) return false
  return currentBuild < targetBuild
}

/**
 * Helper to get installed app version and build number using DeviceInfo.
 */
export function getCurrentAppInfo(): CurrentAppInfo {
  let version = "1.0.0"
  let buildNumber = 1

  try {
    const deviceVer = DeviceInfo.getVersion()
    const deviceBuild = DeviceInfo.getBuildNumber()

    version = deviceVer || Application.nativeApplicationVersion || Constants.expoConfig?.version || "1.0.0"
    const buildStr = deviceBuild || Application.nativeBuildVersion || "1"
    buildNumber = parseInt(buildStr, 10) || 1
  } catch (e) {
    version = Application.nativeApplicationVersion || Constants.expoConfig?.version || "1.0.0"
    const buildStr = Application.nativeBuildVersion || "1"
    buildNumber = parseInt(buildStr, 10) || 1
  }

  return {
    version,
    buildNumber,
    platform: Platform.OS as "ios" | "android",
  }
}


/**
 * Evaluates active versions from backend against current app version.
 */
export function evaluateAppStatus(
  backendVersions: AppVersion[],
  currentVersion: string,
  currentBuild: number,
): VersionEvaluationResult {
  // 1. Filter to only active versions
  const activeVersions = (backendVersions || []).filter((v) => v.isActive)

  if (activeVersions.length === 0) {
    return {
      isMaintenance: false,
      isForceUpdate: false,
      isOptionalUpdate: false,
    }
  }

  // 2. Check if ANY active version requires maintenance mode
  const inMaintenance = activeVersions.some((v) => v.isInMaintenance)
  if (inMaintenance) {
    return {
      isMaintenance: true,
      isForceUpdate: false,
      isOptionalUpdate: false,
    }
  }

  // 3. Filter active versions that are newer than installed version
  const outdatedVersions = activeVersions.filter((v) =>
    isVersionOutdated(currentVersion, currentBuild, v.versionNumber, v.buildNumber),
  )

  if (outdatedVersions.length === 0) {
    return {
      isMaintenance: false,
      isForceUpdate: false,
      isOptionalUpdate: false,
    }
  }

  // Pick the latest target version among outdated versions
  const latestVersion = outdatedVersions.reduce((prev, curr) => {
    const isNewer = isVersionOutdated(
      prev.versionNumber,
      prev.buildNumber,
      curr.versionNumber,
      curr.buildNumber,
    )
    return isNewer ? curr : prev
  }, outdatedVersions[0])

  // Check if ANY of the outdated versions requires a force update
  const forceUpdate = outdatedVersions.some((v) => v.isForceUpdate)

  return {
    isMaintenance: false,
    isForceUpdate: forceUpdate,
    isOptionalUpdate: !forceUpdate,
    latestVersion,
  }
}
