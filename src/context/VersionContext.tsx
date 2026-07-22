import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { AppState, AppStateStatus } from "react-native"

import { AppVersion, getAppVersions } from "@/services/api/modules/appVersions"
import { evaluateAppStatus, getCurrentAppInfo } from "@/utils/versionCheck"

interface VersionContextData {
  isChecking: boolean
  isMaintenance: boolean
  isForceUpdate: boolean
  isOptionalUpdate: boolean
  latestVersion?: AppVersion
  dismissOptionalUpdate: () => void
  checkVersion: () => Promise<void>
}

const VersionContext = createContext<VersionContextData>({} as VersionContextData)

export const VersionProvider = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(false)
  const [isMaintenance, setIsMaintenance] = useState(false)
  const [isForceUpdate, setIsForceUpdate] = useState(false)
  const [isOptionalUpdate, setIsOptionalUpdate] = useState(false)
  const [latestVersion, setLatestVersion] = useState<AppVersion | undefined>(undefined)
  const [dismissedVersionId, setDismissedVersionId] = useState<string | null>(null)

  const checkVersion = useCallback(async () => {
    setIsChecking(true)
    try {
      const appInfo = getCurrentAppInfo()
      const result = await getAppVersions(appInfo.platform)

      if (result.kind === "ok") {
        const evaluation = evaluateAppStatus(result.data, appInfo.version, appInfo.buildNumber)

        setIsMaintenance(evaluation.isMaintenance)
        setIsForceUpdate(evaluation.isForceUpdate)
        setLatestVersion(evaluation.latestVersion)

        if (evaluation.isOptionalUpdate && evaluation.latestVersion) {
          if (evaluation.latestVersion._id !== dismissedVersionId) {
            setIsOptionalUpdate(true)
          } else {
            setIsOptionalUpdate(false)
          }
        } else {
          setIsOptionalUpdate(false)
        }
      }
    } catch (err) {
      console.warn("[VersionCheck] Failed to check app version:", err)
    } finally {
      setIsChecking(false)
    }
  }, [dismissedVersionId])

  const dismissOptionalUpdate = useCallback(() => {
    if (latestVersion?._id) {
      setDismissedVersionId(latestVersion._id)
    }
    setIsOptionalUpdate(false)
  }, [latestVersion?._id])

  // Initial check on mount
  useEffect(() => {
    checkVersion()
  }, [checkVersion])

  // Re-check when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        checkVersion()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [checkVersion])

  return (
    <VersionContext.Provider
      value={{
        isChecking,
        isMaintenance,
        isForceUpdate,
        isOptionalUpdate,
        latestVersion,
        dismissOptionalUpdate,
        checkVersion,
      }}
    >
      {children}
    </VersionContext.Provider>
  )
}

export const useVersion = (): VersionContextData => useContext(VersionContext)
