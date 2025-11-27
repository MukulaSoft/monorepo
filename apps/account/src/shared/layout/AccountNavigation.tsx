'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, NavigationBar } from '@mukulasoft/ui'
import { useAuth } from '@account/core/auth/auth-context'
import { buildTopNavigation } from '@account/core/config/navigation'
import { ACCOUNT_ROUTES } from '@account/core/config/routes'

export function AccountNavigation() {
    const pathname = usePathname()
    const { user, loading, logout } = useAuth()

    const items = buildTopNavigation(user).map((item) => ({
        ...item,
        active: item.href.startsWith('http')
            ? false
            : pathname.startsWith(item.href),
    }))

    return (
        <NavigationBar
            brand={
                <Link
                    href={ACCOUNT_ROUTES.home}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                >
                    MukulaSoft
                </Link>
            }
            items={items}
            linkComponent={Link}
            actions={
                user ? (
                    <Button variant='ghost' onClick={logout} disabled={loading}>
                        Log out
                    </Button>
                ) : (
                    <Link
                        href={ACCOUNT_ROUTES.login}
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontWeight: 700,
                        }}
                    >
                        Sign in
                    </Link>
                )
            }
        />
    )
}
