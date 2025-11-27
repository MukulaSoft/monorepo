const stripTrailingSlash = (url: string) => url.replace(/\/$/, '')

const withFallback = (value: string | undefined, fallback: string) =>
    stripTrailingSlash(value?.trim() || fallback)

export const ACCOUNT_ROUTES = {
    home: '/',
    profile: '/profile',
    security: '/security',
    notifications: '/notifications',
    connections: '/connections',
    login: '/login',
} as const

export const ACCOUNT_ROUTE_LABELS: Record<string, string> = {
    [ACCOUNT_ROUTES.home]: 'overview',
    [ACCOUNT_ROUTES.profile]: 'profile settings',
    [ACCOUNT_ROUTES.security]: 'security center',
    [ACCOUNT_ROUTES.notifications]: 'notification preferences',
    [ACCOUNT_ROUTES.connections]: 'connections',
} as const

const DEFAULT_PORTFOLIO_URL = 'http://localhost:3000'
const DEFAULT_ADMIN_URL = 'http://localhost:3002'

export const EXTERNAL_ROUTES = {
    portfolio: withFallback(
        process.env.NEXT_PUBLIC_PORTFOLIO_APP_URL,
        DEFAULT_PORTFOLIO_URL,
    ),
    adminProjects: `${withFallback(
        process.env.NEXT_PUBLIC_ADMIN_APP_URL,
        DEFAULT_ADMIN_URL,
    )}/projects`,
} as const

export const DOC_ROUTES = {
    securityHardening: '/docs/security/hardening',
    accountAccessHelp: '/docs/account-access/help',
} as const
