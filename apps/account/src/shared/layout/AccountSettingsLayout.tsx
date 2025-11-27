'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationList } from '@mukulasoft/ui'
import { accountSettingsNav } from '@account/core/config/navigation'
import { AccountShell } from './AccountShell'

export function AccountSettingsLayout({
    title = 'Account',
    children,
}: {
    title?: string
    children: ReactNode
}) {
    const pathname = usePathname()

    return (
        <AccountShell>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '220px minmax(0, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                }}
            >
                <aside>
                    <NavigationList
                        title={title}
                        items={accountSettingsNav.map((item) => ({
                            ...item,
                            active: pathname === item.href,
                        }))}
                        linkComponent={Link}
                    />
                </aside>

                <section>{children}</section>
            </div>
        </AccountShell>
    )
}
