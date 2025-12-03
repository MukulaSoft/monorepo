import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialAccountState } from '../data/account'
import { fetchAccountState } from '../lib/api'
import type {
  AccountState,
  IntegrationService,
  NotificationChannels,
  NotificationPreference,
  Profile,
} from '../types/account'

type AccountActions = {
  updateProfile: (payload: Partial<Profile>) => void
  setTwoFactor: (enabled: boolean) => void
  toggleLoginAlerts: (enabled: boolean) => void
  rotateBackupCodes: () => void
  registerPasskey: (label: string) => void
  setDeviceTrust: (deviceId: string, trusted: boolean) => void
  updateNotificationChannel: (
    preferenceId: string,
    channel: keyof NotificationChannels,
    enabled: boolean,
  ) => void
  updateNotificationCadence: (
    preferenceId: string,
    cadence: NotificationPreference['cadence'],
  ) => void
  connectIntegration: (service: IntegrationService) => void
  disconnectIntegration: (service: IntegrationService) => void
  refreshRecommendations: () => void
}

type AccountContextValue = AccountState & { actions: AccountActions }

const AccountContext = createContext<AccountContextValue | null>(null)

const randomConfidence = () => Number((0.6 + Math.random() * 0.35).toFixed(2))

export function AccountProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(initialAccountState.profile)
  const [security, setSecurity] = useState(initialAccountState.security)
  const [notifications, setNotifications] = useState(initialAccountState.notifications)
  const [integrations, setIntegrations] = useState(initialAccountState.integrations)
  const [recommendations, setRecommendations] = useState(initialAccountState.recommendations)

  // Hydrate the local state from the backend API on mount.
  useEffect(() => {
    let cancelled = false

    const hydrateAccount = async () => {
      try {
        const nextState = await fetchAccountState()
        if (cancelled) return
        setProfile(nextState.profile)
        setSecurity(nextState.security)
        setNotifications(nextState.notifications)
        setIntegrations(nextState.integrations)
        setRecommendations(nextState.recommendations)
      } catch (error) {
        console.error('Failed to hydrate account state', error)
      }
    }

    hydrateAccount()

    return () => {
      cancelled = true
    }
  }, [])

  const updateProfile = useCallback<AccountActions['updateProfile']>((payload) => {
    setProfile((prev) => ({ ...prev, ...payload }))
  }, [])

  const setTwoFactor = useCallback<AccountActions['setTwoFactor']>((enabled) => {
    setSecurity((prev) => ({ ...prev, twoFactorEnabled: enabled }))
  }, [])

  const toggleLoginAlerts = useCallback<AccountActions['toggleLoginAlerts']>((enabled) => {
    setSecurity((prev) => ({ ...prev, loginAlerts: enabled }))
  }, [])

  const rotateBackupCodes = useCallback<AccountActions['rotateBackupCodes']>(() => {
    setSecurity((prev) => ({ ...prev, backupCodesRemaining: 10 }))
  }, [])

  const registerPasskey = useCallback<AccountActions['registerPasskey']>((label) => {
    setSecurity((prev) => ({ ...prev, passkeyEnabled: true, passkeyLabel: label }))
  }, [])

  const setDeviceTrust = useCallback<AccountActions['setDeviceTrust']>((deviceId, trusted) => {
    setSecurity((prev) => ({
      ...prev,
      devices: prev.devices.map((device) =>
        device.id === deviceId ? { ...device, trusted } : device,
      ),
    }))
  }, [])

  const updateNotificationChannel = useCallback<AccountActions['updateNotificationChannel']>(
    (preferenceId, channel, enabled) => {
      setNotifications((prev) =>
        prev.map((pref) =>
          pref.id === preferenceId
            ? { ...pref, channels: { ...pref.channels, [channel]: enabled } }
            : pref,
        ),
      )
    },
    [],
  )

  const updateNotificationCadence = useCallback<AccountActions['updateNotificationCadence']>(
    (preferenceId, cadence) => {
      setNotifications((prev) =>
        prev.map((pref) => (pref.id === preferenceId ? { ...pref, cadence } : pref)),
      )
    },
    [],
  )

  const connectIntegration = useCallback<AccountActions['connectIntegration']>((service) => {
    const now = new Date().toISOString()
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === service
          ? {
              ...integration,
              status: 'connected',
              connectedAt: now,
              lastSync: now,
            }
          : integration,
      ),
    )
  }, [])

  const disconnectIntegration = useCallback<AccountActions['disconnectIntegration']>((service) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === service
          ? {
              ...integration,
              status: 'disconnected',
              connectedAt: undefined,
              lastSync: undefined,
            }
          : integration,
      ),
    )
  }, [])

  const refreshRecommendations = useCallback<AccountActions['refreshRecommendations']>(() => {
    setRecommendations((prev) =>
      prev
        .map((item) => ({ ...item, confidence: randomConfidence() }))
        .sort((a, b) => b.confidence - a.confidence),
    )
  }, [])

  const value = useMemo<AccountContextValue>(
    () => ({
      profile,
      security,
      notifications,
      integrations,
      recommendations,
      actions: {
        updateProfile,
        setTwoFactor,
        toggleLoginAlerts,
        rotateBackupCodes,
        registerPasskey,
        setDeviceTrust,
        updateNotificationChannel,
        updateNotificationCadence,
        connectIntegration,
        disconnectIntegration,
        refreshRecommendations,
      },
    }),
    [
      profile,
      security,
      notifications,
      integrations,
      recommendations,
      updateProfile,
      setTwoFactor,
      toggleLoginAlerts,
      rotateBackupCodes,
      registerPasskey,
      setDeviceTrust,
      updateNotificationChannel,
      updateNotificationCadence,
      connectIntegration,
      disconnectIntegration,
      refreshRecommendations,
    ],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}
