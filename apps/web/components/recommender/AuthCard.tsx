'use client'

import { Card, Button } from '@mukulasoft/ui'
import {
    connectionCatalog,
    connectionProviders,
    type AccountConnection,
} from '@mukulasoft/utils'
import { ConnectionGlyph } from './ProviderGlyph'
import styles from '../../styles/AuthCard.module.css'

export type AuthCardProps = {
    userEmail?: string
    connections: AccountConnection[] | null
    loading: boolean
}

type StatusBadgeProps = { connected: boolean }

function StatusBadge({ connected }: StatusBadgeProps) {
    const badgeClass = connected
        ? styles.statusBadgeConnected
        : styles.statusBadgeDisconnected
    return (
        <span className={`${styles.statusBadge} ${badgeClass}`}>
            <span className={styles.statusDot} />
            {connected ? 'Connected' : 'Not linked'}
        </span>
    )
}

export function AuthCard({ userEmail, connections, loading }: AuthCardProps) {
    const statuses = connectionProviders.map((provider) => {
        const definition = connectionCatalog[provider]
        const connection = connections?.find(
            (item) => item.provider === provider,
        )
        return {
            provider,
            name: definition.name,
            description: definition.description,
            connected: connection?.connected ?? false,
            username: connection?.username,
        }
    })

    const noLinks = statuses.every((status) => !status.connected)

    return (
        <Card>
            <header className={styles.header}>
                <h3 className={styles.title}>You</h3>
                <p className={styles.description}>
                    Personal mode looks at whichever accounts you&apos;ve
                    linked.
                </p>
            </header>
            {loading ? (
                <p className={styles.description}>Checking your session…</p>
            ) : userEmail ? (
                <div className={styles.auth}>
                    <p className={styles.authText}>
                        Signed in as <strong>{userEmail}</strong>
                    </p>

                    <div className={styles.list}>
                        {statuses.map((status) => (
                            <div
                                key={status.provider}
                                className={styles.connectionRow}
                            >
                                <div className={styles.connectionMeta}>
                                    <ConnectionGlyph
                                        provider={status.provider}
                                    />
                                    <div>
                                        <p className={styles.connectionName}>
                                            {status.name}
                                        </p>
                                        <small
                                            className={
                                                styles.connectionSubtitle
                                            }
                                        >
                                            {status.connected
                                                ? `Linked as ${status.username ?? 'connected account'}`
                                                : status.description}
                                        </small>
                                    </div>
                                </div>
                                <StatusBadge connected={status.connected} />
                            </div>
                        ))}
                        {noLinks && userEmail && (
                            <small className={styles.hint}>
                                Connect at least one provider to unlock
                                personalized mixes.
                            </small>
                        )}
                        {noLinks && !userEmail && (
                            <small className={styles.hint}>
                                Sign in above to start linking services.
                            </small>
                        )}
                    </div>
                </div>
            ) : (
                <div>Not signed in.</div>
            )}
            <footer className={styles.footer}>
                <Button
                    type='button'
                    variant='ghost'
                    onClick={() =>
                        window.open(
                            'http://localhost:3001/account/connections',
                            '_blank',
                        )
                    }
                    disabled={!userEmail}
                >
                    Manage connections
                </Button>
            </footer>
        </Card>
    )
}
