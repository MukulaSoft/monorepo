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
import { API_BASE, apiGet, apiPut } from './apiClient'

export function useConnections() {
    const [connections, setConnections] = useState<AccountConnection[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingProvider, setUpdatingProvider] =
        useState<ConnectionProvider | null>(null)

    useEffect(() => {
        let cancelled = false

        async function loadConnections() {
            try {
                const response = await apiGet<{
                    connections: AccountConnection[]
                }>('/connections')
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
    }, [])

    const toggleConnection = useCallback(
        async (provider: ConnectionProvider, shouldConnect: boolean) => {
            if (shouldConnect && isOAuthConnectionProvider(provider)) {
                setUpdatingProvider(provider)
                if (typeof window !== 'undefined') {
                    const authorizeUrl = new URL(
                        `${API_BASE}/connections/${provider}/authorize`,
                    )
                    authorizeUrl.searchParams.set(
                        'returnTo',
                        `${window.location.origin}${ACCOUNT_ROUTES.connections}`,
                    )
                    window.location.assign(authorizeUrl.toString())
                }
                return
            }

            setUpdatingProvider(provider)
            setError(null)
            try {
                const response = await apiPut<{
                    connection: AccountConnection
                }>(`/connections/${provider}`, { connected: shouldConnect })
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
        [],
    )

    return { connections, loading, error, updatingProvider, toggleConnection }
}
