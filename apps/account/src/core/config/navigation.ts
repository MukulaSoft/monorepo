import type { NavigationItem } from '@mukulasoft/ui'
import type { User } from '@mukulasoft/utils'
import { ACCOUNT_ROUTES, EXTERNAL_ROUTES } from './routes'

export function buildTopNavigation(user: User | null): NavigationItem[] {
    const items: NavigationItem[] = [
        { label: 'Portfolio', href: EXTERNAL_ROUTES.portfolio, external: true },
        {
            label: 'Account',
            href: ACCOUNT_ROUTES.home,
        },
    ]

    if (user?.isAdmin) {
        items.push({
            label: 'Admin',
            href: EXTERNAL_ROUTES.adminProjects,
            external: true,
        })
    }

    return items
}

export const accountSettingsNav = [
    { href: ACCOUNT_ROUTES.profile, label: 'Profile' },
    { href: ACCOUNT_ROUTES.security, label: 'Security' },
    { href: ACCOUNT_ROUTES.notifications, label: 'Notifications' },
    { href: ACCOUNT_ROUTES.connections, label: 'Connections' },
]
