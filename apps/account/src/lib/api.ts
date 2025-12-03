import { initialAccountState } from '../data/account'
import type {
  AccountState,
  DeviceSession,
  Integration,
  IntegrationService,
  NotificationPreference,
  Recommendation,
  SecuritySettings,
} from '../types/account'
import type {
  AccountApiResponse,
  ApiDeviceSession,
  ApiIntegration,
  ApiNotificationPreference,
  ApiRecommendation,
} from '../types/api'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000').replace(
  /\/$/,
  '',
)
const DEFAULT_ACCOUNT_ID = import.meta.env.VITE_ACCOUNT_ID ?? 'acct-maya-lumen'

const SERVICE_LABELS: Record<IntegrationService, string> = {
  spotify: 'Spotify',
  youtube: 'YouTube Music',
  custom: 'Custom Integration',
}

const fallbackArray = <T>(value: T[] | null | undefined, fallback: T[] = []) =>
  Array.isArray(value) ? value : fallback

const fallbackString = (value: string | null | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value : fallback

const ensureIsoDate = (value: string | null | undefined, fallback: string) => value ?? fallback

export async function fetchAccount(accountId = DEFAULT_ACCOUNT_ID): Promise<AccountApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/accounts/${accountId}`)

  if (!response.ok) {
    throw new Error(`Failed to load account (${response.status})`)
  }

  return (await response.json()) as AccountApiResponse
}

export async function fetchAccountState(accountId?: string): Promise<AccountState> {
  const payload = await fetchAccount(accountId)
  return mapAccountResponse(payload)
}

async function mutateIntegration(
  service: IntegrationService,
  action: 'connect' | 'disconnect',
  accountId = DEFAULT_ACCOUNT_ID,
): Promise<Integration> {
  const response = await fetch(
    `${API_BASE_URL}/api/accounts/${accountId}/integrations/${service}/${action}`,
    {
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to ${action} ${service} (${response.status})`)
  }

  const payload = (await response.json()) as ApiIntegration
  return mapIntegration(payload)
}

export async function connectIntegrationService(
  service: IntegrationService,
  accountId?: string,
): Promise<Integration> {
  return mutateIntegration(service, 'connect', accountId)
}

export async function disconnectIntegrationService(
  service: IntegrationService,
  accountId?: string,
): Promise<Integration> {
  return mutateIntegration(service, 'disconnect', accountId)
}

type RecommendationRefreshResponse = {
  status: string
  message: string
}

export async function queueRecommendationRefresh(
  accountId = DEFAULT_ACCOUNT_ID,
): Promise<RecommendationRefreshResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/accounts/${accountId}/recommendations/refresh`,
    {
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to refresh recommendations (${response.status})`)
  }

  return (await response.json()) as RecommendationRefreshResponse
}

function mapAccountResponse(payload: AccountApiResponse): AccountState {
  return {
    profile: mapProfile(payload),
    security: mapSecurity(payload.security, payload.devices),
    notifications: payload.notifications.map(mapNotification),
    integrations: payload.integrations.map(mapIntegration),
    recommendations: payload.recommendations.map(mapRecommendation),
  }
}

function mapProfile(payload: AccountApiResponse): AccountState['profile'] {
  const fallback = initialAccountState.profile
  return {
    displayName: fallbackString(payload.displayName, fallback.displayName),
    username: fallbackString(payload.username, fallback.username),
    bio: fallbackString(payload.bio, fallback.bio),
    avatarUrl: fallbackString(payload.avatarUrl, fallback.avatarUrl),
    email: fallbackString(payload.email, fallback.email),
    timezone: fallbackString(payload.timezone, fallback.timezone),
    pronouns: fallbackString(payload.pronouns, fallback.pronouns),
    focusRoles: fallbackArray(payload.focusRoles, fallback.focusRoles),
    preferredGenres: fallbackArray(payload.preferredGenres, fallback.preferredGenres),
  }
}

function mapSecurity(
  security: AccountApiResponse['security'],
  devices: ApiDeviceSession[],
): SecuritySettings {
  const fallback = initialAccountState.security
  return {
    twoFactorEnabled: security?.twoFactorEnabled ?? fallback.twoFactorEnabled,
    passkeyEnabled: security?.passkeyEnabled ?? fallback.passkeyEnabled,
    passkeyLabel: security?.passkeyLabel ?? fallback.passkeyLabel,
    backupCodesRemaining: security?.backupCodesRemaining ?? fallback.backupCodesRemaining,
    lastPasswordChange: ensureIsoDate(security?.lastPasswordChange, fallback.lastPasswordChange),
    loginAlerts: security?.loginAlerts ?? fallback.loginAlerts,
    devices: devices.map(mapDevice),
  }
}

function mapDevice(device: ApiDeviceSession): DeviceSession {
  const fallbackDevice = initialAccountState.security.devices[0]
  return {
    id: device.id,
    label: fallbackString(device.label, fallbackDevice?.label ?? 'Session'),
    location: fallbackString(device.location, fallbackDevice?.location ?? 'Unknown location'),
    lastActive: ensureIsoDate(
      device.lastActive,
      fallbackDevice?.lastActive ?? new Date().toISOString(),
    ),
    trusted: device.trusted,
  }
}

function mapNotification(preference: ApiNotificationPreference): NotificationPreference {
  const fallback = initialAccountState.notifications[0]
  return {
    id: preference.key,
    title: fallbackString(preference.title, fallback.title),
    description: fallbackString(preference.description, fallback.description),
    cadence: preference.cadence,
    channels: {
      email: preference.email,
      push: preference.push,
      sms: preference.sms,
    },
  }
}

export function mapIntegration(integration: ApiIntegration): Integration {
  const service = integration.service as IntegrationService
  return {
    id: service,
    title: SERVICE_LABELS[service],
    status: integration.status,
    plan: integration.plan ?? undefined,
    scopes: fallbackArray(integration.scopes, []),
    connectedAt: integration.connectedAt ?? undefined,
    lastSync: integration.lastSync ?? undefined,
  }
}

function mapRecommendation(recommendation: ApiRecommendation): Recommendation {
  const source = recommendation.sourceService as IntegrationService
  return {
    id: recommendation.id,
    title: recommendation.title,
    description: fallbackString(
      recommendation.description,
      initialAccountState.recommendations[0]?.description ?? 'Recommendation',
    ),
    confidence: recommendation.confidence,
    source,
    signals: fallbackArray(recommendation.signals, []),
  }
}
