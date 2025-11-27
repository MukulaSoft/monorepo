'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    createEmptyConnections,
    isOAuthConnectionProvider,
    normalizeConnections,
    type AccountConnection,
    type ConnectionProvider,
} from '@mukulasoft/utils'
import { ACCOUNT_ROUTES } from '@account/core/config/routes'
import {
    buildAuthorizeUrl,
    connectionsService,
} from '../api/connectionsService'

type UseConnectionsOptions = {
    enabled?: boolean
}

export function useConnections(options: UseConnectionsOptions = {}) {
    const { enabled = true } = options
    const [connections, setConnections] = useState<AccountConnection[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingProvider, setUpdatingProvider] =
        useState<ConnectionProvider | null>(null)

    useEffect(() => {
        if (!enabled) {
            setConnections(createEmptyConnections())
            setLoading(false)
            setError(null)
            return
        }

        let cancelled = false

        async function loadConnections() {
            try {
                const response = await connectionsService.list()
                if (cancelled) return

                const normalized = normalizeConnections(response.connections)
                setConnections(normalized)
            } catch (err) {
                if (cancelled) return
                console.error(err)
                setError("We couldn't load your connections yet.")
                setConnections(createEmptyConnections())
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadConnections()

        return () => {
            cancelled = true
        }
    }, [enabled])

    const toggleConnection = useCallback(
        async (provider: ConnectionProvider, shouldConnect: boolean) => {
            if (!enabled) {
                setError('Sign in to manage connections.')
                return
            }
            if (shouldConnect && isOAuthConnectionProvider(provider)) {
                setUpdatingProvider(provider)
                if (typeof window !== 'undefined') {
                    const returnTo = `${window.location.origin}${ACCOUNT_ROUTES.connections}`
                    window.location.assign(
                        buildAuthorizeUrl(provider, returnTo),
                    )
                }
                return
            }

            setUpdatingProvider(provider)
            setError(null)
            try {
                const response = await connectionsService.update(
                    provider,
                    shouldConnect,
                )
                setConnections((prev) =>
                    prev.map((conn) =>
                        conn.provider === provider ? response.connection : conn,
                    ),
                )
            } catch (err) {
                console.error(err)
                setError(
                    "We couldn't update that connection. Please try again.",
                )
            } finally {
                setUpdatingProvider(null)
            }
        },
        [enabled],
    )

    return { connections, loading, error, updatingProvider, toggleConnection }
}
