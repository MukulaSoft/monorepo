'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
    RecoveryCodesBundle,
    SecuritySettingsPayload,
    TwoFactorEnrollment,
} from '@mukulasoft/utils'
import { securityService } from '../api/securityService'

type PendingAction =
    | 'fetch'
    | 'prepare'
    | 'confirm'
    | 'disable'
    | 'regenerate'
    | null

function resolveErrorMessage(err: unknown) {
    if (err instanceof Error) {
        return err.message
    }
    return 'Something went wrong. Please try again.'
}

type LoadOptions = {
    silent?: boolean
}

export function useSecuritySettings() {
    const [settings, setSettings] = useState<SecuritySettingsPayload | null>(
        null,
    )
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pendingAction, setPendingAction] = useState<PendingAction>(null)
    const [enrollment, setEnrollment] = useState<TwoFactorEnrollment | null>(
        null,
    )
    const [recoveryBundle, setRecoveryBundle] =
        useState<RecoveryCodesBundle | null>(null)

    const load = useCallback(async (options: LoadOptions = {}) => {
        if (!options.silent) {
            setLoading(true)
        }
        setError(null)
        try {
            const payload = await securityService.getSettings()
            setSettings(payload)
        } catch (err) {
            setError(resolveErrorMessage(err))
        } finally {
            if (!options.silent) {
                setLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    const startEnrollment = useCallback(async () => {
        setPendingAction('prepare')
        setError(null)
        try {
            const data = await securityService.prepareTwoFactor()
            setEnrollment(data)
            setRecoveryBundle(null)
        } catch (err) {
            setError(resolveErrorMessage(err))
        } finally {
            setPendingAction(null)
        }
    }, [])

    const confirmEnrollment = useCallback(
        async (code: string) => {
            setPendingAction('confirm')
            setError(null)
            try {
                const bundle = await securityService.confirmTwoFactor({ code })
                setRecoveryBundle(bundle)
                setEnrollment(null)
                await load({ silent: true })
            } catch (err) {
                setError(resolveErrorMessage(err))
            } finally {
                setPendingAction(null)
            }
        },
        [load],
    )

    const disableTwoFactor = useCallback(async () => {
        setPendingAction('disable')
        setError(null)
        try {
            await securityService.disableTwoFactor()
            setEnrollment(null)
            setRecoveryBundle(null)
            await load({ silent: true })
        } catch (err) {
            setError(resolveErrorMessage(err))
        } finally {
            setPendingAction(null)
        }
    }, [load])

    const regenerateCodes = useCallback(async () => {
        setPendingAction('regenerate')
        setError(null)
        try {
            const bundle = await securityService.regenerateRecoveryCodes()
            setRecoveryBundle(bundle)
            await load({ silent: true })
        } catch (err) {
            setError(resolveErrorMessage(err))
        } finally {
            setPendingAction(null)
        }
    }, [load])

    const dismissRecoveryBundle = useCallback(() => {
        setRecoveryBundle(null)
    }, [])

    const state = useMemo(
        () => ({
            settings,
            loading,
            error,
            pendingAction,
            enrollment,
            recoveryBundle,
            startEnrollment,
            confirmEnrollment,
            disableTwoFactor,
            regenerateCodes,
            reload: () => load({ silent: true }),
            dismissRecoveryBundle,
        }),
        [
            settings,
            loading,
            error,
            pendingAction,
            enrollment,
            recoveryBundle,
            startEnrollment,
            confirmEnrollment,
            disableTwoFactor,
            regenerateCodes,
            load,
            dismissRecoveryBundle,
        ],
    )

    return state
}
