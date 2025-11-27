'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, NavigationBar, type NavigationItem } from '@mukulasoft/ui'
import { useAuth } from '../lib/authContext'

export function RecommenderNavigation() {
    const pathname = usePathname()
    const { user, logout, loading } = useAuth()

    const items: NavigationItem[] = [
        { label: 'Portfolio', href: 'http://localhost:3000', external: true },
        {
            label: 'Account',
            href: '/account',
            active: pathname.startsWith('/account'),
        },
    ]

    if (user?.isAdmin) {
        items.push({
            label: 'Admin',
            href: 'http://localhost:3002/projects',
            external: true,
        })
    }

    return (
        <NavigationBar
            brand={
                <Link
                    href='http://localhost:3000'
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
                        href='http://localhost:3001/login'
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
