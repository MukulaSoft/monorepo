import type {
    RecoveryCodesBundle,
    SecuritySettingsPayload,
    TwoFactorEnrollment,
} from '@mukulasoft/utils'
import { httpClient } from '@account/core/api/httpClient'

export type ConfirmTwoFactorPayload = {
    code: string
}

export const securityService = {
    getSettings: () => httpClient.get<SecuritySettingsPayload>('/security'),
    prepareTwoFactor: () =>
        httpClient.post<TwoFactorEnrollment>(
            '/security/two-factor/prepare',
            {},
        ),
    confirmTwoFactor: (payload: ConfirmTwoFactorPayload) =>
        httpClient.post<RecoveryCodesBundle>(
            '/security/two-factor/confirm',
            payload,
        ),
    disableTwoFactor: () => httpClient.post('/security/two-factor/disable', {}),
    regenerateRecoveryCodes: () =>
        httpClient.post<RecoveryCodesBundle>(
            '/security/recovery-codes/regenerate',
            {},
        ),
}
