export type DeviceSession = {
  id: string
  label: string
  location: string
  lastActive: string
  trusted: boolean
}

export type Profile = {
  displayName: string
  username: string
  bio: string
  avatarUrl: string
  email: string
  timezone: string
  pronouns: string
  focusRoles: string[]
  preferredGenres: string[]
}

export type SecuritySettings = {
  twoFactorEnabled: boolean
  passkeyEnabled: boolean
  passkeyLabel?: string
  backupCodesRemaining: number
  lastPasswordChange: string
  devices: DeviceSession[]
  loginAlerts: boolean
}

export type NotificationChannels = {
  email: boolean
  push: boolean
  sms: boolean
}

export type NotificationPreference = {
  id: string
  title: string
  description: string
  cadence: 'realtime' | 'daily' | 'weekly'
  channels: NotificationChannels
}

export type IntegrationService = 'spotify' | 'youtube'
export type IntegrationStatus = 'connected' | 'disconnected' | 'action_required'

export type Integration = {
  id: IntegrationService
  title: string
  status: IntegrationStatus
  connectedAt?: string
  plan?: string
  scopes: string[]
  lastSync?: string
}

export type Recommendation = {
  id: string
  title: string
  description: string
  confidence: number
  source: IntegrationService
  signals: string[]
}

export type AccountState = {
  profile: Profile
  security: SecuritySettings
  notifications: NotificationPreference[]
  integrations: Integration[]
  recommendations: Recommendation[]
}
