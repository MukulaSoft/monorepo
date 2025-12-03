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
import {
  connectIntegrationService,
  disconnectIntegrationService,
  fetchAccountState,
  queueRecommendationRefresh,
} from '../lib/api'
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
  connectIntegration: (service: IntegrationService) => Promise<void>
  disconnectIntegration: (service: IntegrationService) => Promise<void>
  refreshRecommendations: () => Promise<void>
  reloadAccount: () => Promise<void>
}

type HydrationState = {
  status: 'loading' | 'refreshing' | 'ready' | 'error'
  error: string | null
  lastUpdated: string | null
}

type AccountContextValue = AccountState & { hydration: HydrationState; actions: AccountActions }

const AccountContext = createContext<AccountContextValue | null>(null)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(initialAccountState.profile)
  const [security, setSecurity] = useState(initialAccountState.security)
  const [notifications, setNotifications] = useState(initialAccountState.notifications)
  const [integrations, setIntegrations] = useState(initialAccountState.integrations)
  const [recommendations, setRecommendations] = useState(initialAccountState.recommendations)
  const [hydration, setHydration] = useState<HydrationState>({
    status: 'loading',
    error: null,
    lastUpdated: null,
  })

  const applyAccountSnapshot = useCallback((nextState: AccountState) => {
    setProfile(nextState.profile)
    setSecurity(nextState.security)
    setNotifications(nextState.notifications)
    setIntegrations(nextState.integrations)
    setRecommendations(nextState.recommendations)
  }, [])

  const loadAccountState = useCallback(
    async (mode: 'initial' | 'refetch' = 'initial') => {
      setHydration((prev) => ({
        status: mode === 'initial' ? 'loading' : 'refreshing',
        error: null,
        lastUpdated: prev.lastUpdated,
      }))

      try {
        const nextState = await fetchAccountState()
        applyAccountSnapshot(nextState)
        const hydratedAt = new Date().toISOString()
        setHydration({ status: 'ready', error: null, lastUpdated: hydratedAt })
        return nextState
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load account data'
        setHydration((prev) => ({
          status: 'error',
          error: message,
          lastUpdated: prev.lastUpdated,
        }))
        throw error
      }
    },
    [applyAccountSnapshot],
  )

  // Hydrate the local state from the backend API on mount.
  useEffect(() => {
    void loadAccountState('initial')
  }, [loadAccountState])

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

  const connectIntegration = useCallback<AccountActions['connectIntegration']>(
    async (service) => {
      try {
        await connectIntegrationService(service)
        await loadAccountState('refetch')
      } catch (error) {
        console.error(`Failed to connect integration ${service}`, error)
      }
    },
    [loadAccountState],
  )

  const disconnectIntegration = useCallback<AccountActions['disconnectIntegration']>(
    async (service) => {
      try {
        await disconnectIntegrationService(service)
        await loadAccountState('refetch')
      } catch (error) {
        console.error(`Failed to disconnect integration ${service}`, error)
      }
    },
    [loadAccountState],
  )

  const refreshRecommendations = useCallback<AccountActions['refreshRecommendations']>(async () => {
    try {
      await queueRecommendationRefresh()
      await loadAccountState('refetch')
    } catch (error) {
      console.error('Failed to refresh recommendations', error)
    }
  }, [loadAccountState])

  const reloadAccount = useCallback<AccountActions['reloadAccount']>(async () => {
    try {
      await loadAccountState('initial')
    } catch (error) {
      console.error('Failed to reload account state', error)
    }
  }, [loadAccountState])

  const value = useMemo<AccountContextValue>(
    () => ({
      profile,
      security,
      notifications,
      integrations,
      recommendations,
      hydration,
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
        reloadAccount,
      },
    }),
    [
      profile,
      security,
      notifications,
      integrations,
      recommendations,
      hydration,
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
      reloadAccount,
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
