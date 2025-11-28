import { Suspense } from 'react'
import { Card } from '@mukulasoft/ui'
import { AccountSettingsLayout } from '@account/shared/layout/AccountSettingsLayout'
import { PageHeader } from '@account/shared/components/PageHeader'
import { SecuritySettingsContent } from './SecuritySettingsContent'

export function SecuritySettingsScreen() {
    return (
        <AccountSettingsLayout>
            <PageHeader
                title='Security'
                description='Manage password policies, two-factor authentication, and sessions.'
            />
            <Suspense fallback={<Card>Loading security controls…</Card>}>
                <SecuritySettingsContent />
            </Suspense>
        </AccountSettingsLayout>
    )
}
