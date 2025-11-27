import { Card, Switch, mukulaTheme } from '@mukulasoft/ui'
import type { AccountConnection, ConnectionProvider } from '@mukulasoft/utils'

type ConnectionCardProps = {
    connection: AccountConnection
    accent?: string
    icon?: string
    disabled: boolean
    isUpdating: boolean
    onToggle: (checked: boolean) => void
}

const providerStyles: Record<
    ConnectionProvider,
    { accent: string; icon: string }
> = {
    spotify: {
        accent: '#1DB954',
        icon: '♪',
    },
    youtube: {
        accent: '#FF3D00',
        icon: '▶',
    },
}

export function ConnectionCard({
    connection,
    disabled,
    isUpdating,
    onToggle,
}: ConnectionCardProps) {
    const { accent, icon } = providerStyles[connection.provider] ?? {
        accent: mukulaTheme.colors.accent[500],
        icon: '⚡',
    }

    const lastSynced = formatTimestamp(connection.connectedAt)

    return (
        <Card>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.9rem',
                            alignItems: 'center',
                            flex: '1 1 240px',
                        }}
                    >
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 18,
                                background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
                                color: accent,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '1.5rem',
                                boxShadow:
                                    'inset 0 0 0 1px rgba(255,255,255,0.08)',
                            }}
                            aria-hidden
                        >
                            {icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700 }}>
                                {connection.name}
                            </p>
                            <p
                                style={{
                                    margin: '0.25rem 0 0',
                                    color: mukulaTheme.colors.textMuted,
                                    fontSize: '0.95rem',
                                }}
                            >
                                {connection.description}
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <Switch
                            checked={connection.connected}
                            onCheckedChange={onToggle}
                            disabled={disabled}
                            aria-label={`Toggle ${connection.name} connection`}
                        />
                        <span
                            style={{
                                fontWeight: 600,
                                color: connection.connected
                                    ? accent
                                    : mukulaTheme.colors.textMuted,
                            }}
                        >
                            {connection.connected
                                ? 'Connected'
                                : 'Disconnected'}
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem',
                        color: mukulaTheme.colors.textMuted,
                        fontSize: '0.92rem',
                    }}
                >
                    {connection.connected ? (
                        <span>
                            Linked as{' '}
                            <strong style={{ color: mukulaTheme.colors.text }}>
                                {connection.username}
                            </strong>
                            {lastSynced ? ` • since ${lastSynced}` : ''}
                        </span>
                    ) : (
                        <span>
                            Flip the switch to connect your {connection.name}.
                        </span>
                    )}

                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: isUpdating
                                    ? accent
                                    : 'rgba(255,255,255,0.35)',
                            }}
                        />
                        {isUpdating
                            ? 'Saving changes…'
                            : connection.connected
                              ? 'We refresh this connection every few minutes.'
                              : 'No data is shared until you connect.'}
                    </span>
                </div>
            </div>
        </Card>
    )
}

function formatTimestamp(value?: string) {
    if (!value) return ''
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value))
    } catch {
        return value
    }
}
