import { Card } from '@mukulasoft/ui'
import { AccountSettingsLayout } from '@account/shared/layout/AccountSettingsLayout'
import { PageHeader } from '@account/shared/components/PageHeader'

export function SecuritySettingsScreen() {
    return (
        <AccountSettingsLayout>
            <PageHeader
                title='Security'
                description='Manage password policies, two-factor authentication, and sessions.'
            />
            <Card>
                <p>
                    This is where you&apos;ll manage password, 2FA, and login
                    sessions. For now, this page is a stub. Next step would be
                    to add toggles for login alerts and two-factor auth backed
                    by the API.
                </p>
            </Card>
        </AccountSettingsLayout>
    )
}
