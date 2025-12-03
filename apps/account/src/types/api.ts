export type ApiDeviceSession = {
  id: string
  label: string
  location: string | null
  lastActive: string | null
  trusted: boolean
}

export type ApiNotificationPreference = {
  id: string
  key: string
  title: string
  description: string | null
  cadence: 'realtime' | 'daily' | 'weekly'
  email: boolean
  push: boolean
  sms: boolean
}

export type ApiIntegration = {
  id: string
  service: 'spotify' | 'youtube' | 'custom'
  status: 'connected' | 'disconnected' | 'action_required'
  plan: string | null
  scopes: string[] | null
  connectedAt: string | null
  lastSync: string | null
}

export type ApiRecommendation = {
  id: string
  title: string
  description: string | null
  confidence: number
  sourceService: 'spotify' | 'youtube' | 'custom'
  signals: string[] | null
}

export type ApiSecuritySettings = {
  id: string
  twoFactorEnabled: boolean
  passkeyEnabled: boolean
  passkeyLabel: string | null
  backupCodesRemaining: number
  lastPasswordChange: string | null
  loginAlerts: boolean
}

export type AccountApiResponse = {
  id: string
  displayName: string
  username: string
  bio: string | null
  avatarUrl: string | null
  email: string
  timezone: string | null
  pronouns: string | null
  focusRoles: string[] | null
  preferredGenres: string[] | null
  security: ApiSecuritySettings | null
  devices: ApiDeviceSession[]
  notifications: ApiNotificationPreference[]
  integrations: ApiIntegration[]
  recommendations: ApiRecommendation[]
}
