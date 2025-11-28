export type TwoFactorMethod = 'totp'

export type TwoFactorProfile = {
    enabled: boolean
    method: TwoFactorMethod
    confirmedAt?: string
    lastUsedAt?: string
    recoveryCodesRemaining: number
}

export type SecuritySettingsPayload = {
    twoFactor: TwoFactorProfile
}

export type TwoFactorEnrollment = {
    method: TwoFactorMethod
    secret: string
    otpAuthUrl: string
    expiresAt: string
}

export type RecoveryCodesBundle = {
    codes: string[]
    generatedAt: string
}
