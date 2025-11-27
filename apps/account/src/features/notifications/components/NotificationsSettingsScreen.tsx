import { Card } from '@mukulasoft/ui'
import { AccountSettingsLayout } from '@account/shared/layout/AccountSettingsLayout'
import { PageHeader } from '@account/shared/components/PageHeader'

export function NotificationsSettingsScreen() {
    return (
        <AccountSettingsLayout>
            <PageHeader
                title='Notifications'
                description='Control MukulaSoft email and in-app notifications.'
            />
            <Card>
                <p>
                    Notification preferences will live here. Wire these up to
                    the API to allow channel level overrides and digest
                    settings.
                </p>
            </Card>
        </AccountSettingsLayout>
    )
}
