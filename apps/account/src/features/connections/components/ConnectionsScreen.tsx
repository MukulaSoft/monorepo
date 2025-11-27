'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, mukulaTheme } from '@mukulasoft/ui'
import { connectionProviders, type ConnectionProvider } from '@mukulasoft/utils'
import { AccountSettingsLayout } from '@account/shared/layout/AccountSettingsLayout'
import { PageHeader } from '@account/shared/components/PageHeader'
import { useConnections } from '../hooks/useConnections'
import { ConnectionCard } from './ConnectionCard'
import { ConnectionFlash, type FlashMessage } from './ConnectionFlash'

export function ConnectionsScreen() {
    const { connections, loading, error, updatingProvider, toggleConnection } =
        useConnections()
    const searchParams = useSearchParams()

    const flash = useMemo(() => {
        if (!searchParams) return null
        const status = searchParams.get('status')
        const connection = searchParams.get(
            'connection',
        ) as ConnectionProvider | null
        if (
            !status ||
            !connection ||
            !connectionProviders.includes(connection)
        ) {
            return null
        }
        const reason = searchParams.get('reason') ?? undefined
        return buildFlashMessage(connection, status, reason)
    }, [searchParams])

    return (
        <AccountSettingsLayout>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                }}
            >
                <PageHeader
                    title='Connections'
                    description='Link Spotify or YouTube Music to surface richer activity across the MukulaSoft apps. More services are on the way.'
                />

                {flash && <ConnectionFlash message={flash} />}

                {error && (
                    <Card>
                        <p style={{ margin: 0, color: '#ffbdbd' }}>{error}</p>
                    </Card>
                )}

                {loading && !connections.length ? (
                    <Card>
                        <p
                            style={{
                                margin: 0,
                                color: mukulaTheme.colors.textMuted,
                            }}
                        >
                            Loading your linked accounts…
                        </p>
                    </Card>
                ) : (
                    connections.map((connection) => (
                        <ConnectionCard
                            key={connection.provider}
                            connection={connection}
                            disabled={
                                loading ||
                                updatingProvider === connection.provider
                            }
                            isUpdating={
                                updatingProvider === connection.provider
                            }
                            onToggle={(next) => {
                                void toggleConnection(connection.provider, next)
                            }}
                        />
                    ))
                )}
            </div>
        </AccountSettingsLayout>
    )
}

function buildFlashMessage(
    provider: ConnectionProvider,
    status: string,
    reason?: string,
): FlashMessage | null {
    if (status === 'success') {
        return {
            tone: 'success',
            text: `${providerLabel(provider)} connected. We'll keep it in sync automatically.`,
        }
    }

    if (status === 'error') {
        const reasonCopy: Record<ConnectionProvider, Record<string, string>> = {
            spotify: {
                user_cancelled:
                    'Spotify sign-in was cancelled. Please try again.',
                spotify_error:
                    'Spotify reported an error. Give it another shot.',
                invalid_state:
                    'Your session expired. Start the Spotify link again.',
                missing_code: "Spotify didn't send us the approval code.",
                unauthorized: 'Please sign in again before linking Spotify.',
                exchange_failed: "We couldn't finish the Spotify handshake.",
            },
            youtube: {
                user_cancelled:
                    'Google sign-in was cancelled. Please try again.',
                youtube_error:
                    'Google reported an error. Give it another shot.',
                invalid_state:
                    'Your session expired. Start the YouTube link again.',
                missing_code: "Google didn't send us the approval code.",
                unauthorized: 'Please sign in again before linking YouTube.',
                exchange_failed: "We couldn't finish the YouTube handshake.",
            },
        }

        const copy = reason ? reasonCopy[provider]?.[reason] : undefined

        return {
            tone: 'error',
            text:
                copy ??
                `We couldn't connect to ${providerLabel(provider)}. Please try again.`,
        }
    }

    return null
}

function providerLabel(provider: ConnectionProvider) {
    return provider === 'youtube' ? 'YouTube Music' : 'Spotify'
}
