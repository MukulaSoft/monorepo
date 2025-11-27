import { slugify } from './strings'

export const connectionProviders = ['spotify', 'youtube'] as const

export type ConnectionProvider = (typeof connectionProviders)[number]

export type ConnectionDefinition = {
    provider: ConnectionProvider
    name: string
    description: string
}

export type ConnectionState = {
    provider: ConnectionProvider
    connected: boolean
    username?: string
    connectedAt?: string
}

export type AccountConnection = ConnectionDefinition & ConnectionState

export const connectionCatalog: Record<
    ConnectionProvider,
    ConnectionDefinition
> = {
    spotify: {
        provider: 'spotify',
        name: 'Spotify',
        description:
            'Sync your Spotify profile so MukulaSoft services can utilize it.',
    },
    youtube: {
        provider: 'youtube',
        name: 'YouTube Music',
        description:
            'Link your YouTube account so we can pull personalized mixes.',
    },
}

const oauthProviders = new Set<ConnectionProvider>(['spotify', 'youtube'])

export function isOAuthConnectionProvider(
    provider: ConnectionProvider,
): boolean {
    return oauthProviders.has(provider)
}

export function isConnectionProvider(
    value: string,
): value is ConnectionProvider {
    return connectionProviders.includes(value as ConnectionProvider)
}

export function createEmptyConnections(): AccountConnection[] {
    return connectionProviders.map((provider) => ({
        ...connectionCatalog[provider],
        connected: false,
    }))
}

export function normalizeConnections(
    data?: AccountConnection[],
): AccountConnection[] {
    const map = new Map<ConnectionProvider, AccountConnection>()
    ;(data ?? []).forEach((conn) => {
        map.set(conn.provider, conn)
    })

    return connectionProviders.map((provider) => {
        return (
            map.get(provider) ?? {
                ...connectionCatalog[provider],
                connected: false,
            }
        )
    })
}

export type HandleOptions = {
    maxLength?: number
    fallback?: string
}

export function buildConnectionHandle(
    source: string,
    provider: ConnectionProvider,
    options: HandleOptions = {},
): string {
    const base = slugify(source, {
        maxLength: options.maxLength ?? 24,
        fallback: options.fallback ?? 'mukulasoft-listener',
    })
    return `${base}-${provider}`
}
