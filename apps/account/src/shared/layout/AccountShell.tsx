import type { ReactNode } from 'react'
import { LayoutShell } from '@mukulasoft/ui'
import { AccountNavigation } from './AccountNavigation'

export function AccountShell({ children }: { children: ReactNode }) {
    return (
        <LayoutShell>
            <AccountNavigation />
            <div style={{ marginTop: '1.4rem' }}>{children}</div>
        </LayoutShell>
    )
}
