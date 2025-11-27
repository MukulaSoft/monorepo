'use client'

import Link from 'next/link'
import { useMemo, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, PageSection, useTheme } from '@mukulasoft/ui'
import { AccountShell } from '@account/shared/layout/AccountShell'
import { PageHeader } from '@account/shared/components/PageHeader'
import { useAuth } from '@account/core/auth/auth-context'
import { useConnections } from '@account/features/connections/hooks/useConnections'
import {
    ACCOUNT_ROUTES,
    ACCOUNT_ROUTE_LABELS,
    DOC_ROUTES,
} from '@account/core/config/routes'

type TimelineItem = {
    id: string
    title: string
    detail: string
    timestamp: string
    category: 'profile' | 'security' | 'connections'
}

const STATIC_ACTIVITY: TimelineItem[] = [
    {
        id: 'security-review',
        title: 'Security checkup scheduled',
        detail: 'Enable MFA and rotate recovery codes every quarter.',
        timestamp: 'Due next week',
        category: 'security',
    },
    {
        id: 'notifications',
        title: 'Notification defaults applied',
        detail: 'Product updates sent to primary email. Alerts muted.',
        timestamp: '3 days ago',
        category: 'profile',
    },
    {
        id: 'policy',
        title: 'Privacy policy acknowledged',
        detail: 'You accepted the latest policy & DPA.',
        timestamp: '2 weeks ago',
        category: 'security',
    },
]

const KNOWLEDGE_LINKS = [
    {
        title: 'Hardening your account perimeter',
        description: 'Checklist for passwords, recovery channels, and MFA.',
        href: '/docs/security/hardening',
    },
    {
        title: 'Connecting streaming providers securely',
        description: 'Scopes we request and how we store provider tokens.',
        href: '/docs/connections/overview',
    },
    {
        title: 'Email notifications map',
        description: 'Understand each template before toggling preferences.',
        href: '/docs/notifications/catalog',
    },
]

type StatusTone = 'success' | 'warn' | 'info'

type StatusCard = {
    id: string
    label: string
    value: string
    helper: string
    tone: StatusTone
}

export function AccountOverview() {
    const theme = useTheme()
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const {
        connections,
        loading: connectionsLoading,
        error: connectionsError,
    } = useConnections({ enabled: Boolean(user) })

    const isGuestExperience = !authLoading && !user

    const welcomeName = user?.displayName?.trim() || 'there'

    const profileCompletion = useMemo(() => {
        if (!user) return 0
        let score = 40
        if (user.displayName?.trim()) score += 30
        if (user.bio?.trim()) score += 30
        return Math.min(score, 100)
    }, [user])

    const connectedCount = useMemo(
        () => connections.filter((conn) => conn.connected).length,
        [connections],
    )

    const quickActions = useMemo(
        () => [
            {
                id: 'profile',
                title:
                    profileCompletion === 100
                        ? 'Profile is up to date'
                        : 'Complete your profile',
                description:
                    profileCompletion === 100
                        ? 'Share milestone updates so collaborators stay aligned.'
                        : 'Add a richer bio and avatar to unlock personalization.',
                href: ACCOUNT_ROUTES.profile,
                primary: true,
            },
            {
                id: 'security',
                title: 'Run a security check-in',
                description:
                    'Rotate recovery codes, confirm devices, and enable passkeys.',
                href: ACCOUNT_ROUTES.security,
                primary: false,
            },
            {
                id: 'connections',
                title:
                    connectedCount > 0
                        ? 'Review connected accounts'
                        : 'Link a streaming provider',
                description:
                    connectedCount > 0
                        ? 'Verify scopes & refresh tokens for existing providers.'
                        : 'Connect Spotify or YouTube Music to personalize insights.',
                href: ACCOUNT_ROUTES.connections,
                primary: false,
            },
        ],
        [profileCompletion, connectedCount],
    )

    const statusCards = useMemo<StatusCard[]>(() => {
        if (isGuestExperience) {
            return [
                {
                    id: 'guest-profile',
                    label: 'Profile insights',
                    value: 'Sign in',
                    helper: 'Log in to view personalization progress.',
                    tone: 'warn' as StatusTone,
                },
                {
                    id: 'guest-security',
                    label: 'Security posture',
                    value: 'Hidden',
                    helper: 'Authentication required to view sensitive data.',
                    tone: 'info' as StatusTone,
                },
                {
                    id: 'guest-connections',
                    label: 'Connections',
                    value: '0 linked',
                    helper: 'Link Spotify or YouTube once you are signed in.',
                    tone: 'warn' as StatusTone,
                },
                {
                    id: 'guest-notifications',
                    label: 'Notifications',
                    value: 'Default',
                    helper: 'Customize delivery preferences after signing in.',
                    tone: 'info' as StatusTone,
                },
            ]
        }

        return [
            {
                id: 'profile-health',
                label: 'Profile completeness',
                value: authLoading ? 'Loading…' : `${profileCompletion}%`,
                helper:
                    profileCompletion === 100
                        ? 'Nice work—profile signals are strong.'
                        : 'Add more context so services can personalize.',
                tone: profileCompletion === 100 ? 'success' : 'warn',
            },
            {
                id: 'connections-health',
                label: 'Connections',
                value: connectionsLoading
                    ? 'Loading…'
                    : `${connectedCount}/${connections.length || 0}`,
                helper: connectionsError
                    ? connectionsError
                    : connectedCount > 0
                      ? 'Synced and ready for catalog ingest.'
                      : 'No providers linked yet.',
                tone:
                    connectionsError || connectedCount === 0
                        ? 'warn'
                        : 'success',
            },
            {
                id: 'security-health',
                label: 'Security posture',
                value: '2 open tasks',
                helper: 'Enable MFA + review device list.',
                tone: 'info',
            },
            {
                id: 'notification-health',
                label: 'Notifications',
                value: 'Personalized',
                helper: 'Critical alerts on, marketing muted.',
                tone: 'success',
            },
        ]
    }, [
        authLoading,
        profileCompletion,
        connectionsLoading,
        connectedCount,
        connections.length,
        connectionsError,
        isGuestExperience,
    ])

    const timelineItems = useMemo(() => {
        const items: TimelineItem[] = [...STATIC_ACTIVITY]
        if (connectedCount > 0) {
            items.unshift({
                id: 'connections-sync',
                title: 'Connections synced',
                detail: `Actively linked to ${connectedCount} provider${connectedCount > 1 ? 's' : ''}.`,
                timestamp: 'Moments ago',
                category: 'connections',
            })
        }
        return items.slice(0, 4)
    }, [connectedCount])

    const recommendedTasks = useMemo(
        () => [
            {
                id: 'task-bio',
                title: 'Expand your bio',
                description:
                    'Add at least 140 characters so downstream apps have context.',
                href: ACCOUNT_ROUTES.profile,
                done: profileCompletion === 100,
            },
            {
                id: 'task-mfa',
                title: 'Turn on multi-factor auth',
                description:
                    'Protect sensitive catalog actions with an extra approval step.',
                href: ACCOUNT_ROUTES.security,
                done: false,
            },
            {
                id: 'task-connections',
                title: 'Connect a provider',
                description:
                    'Link Spotify or YouTube to unlock personalized projects.',
                href: ACCOUNT_ROUTES.connections,
                done: connectedCount > 0,
            },
        ],
        [profileCompletion, connectedCount],
    )

    const statusToneStyles: Record<StatusTone, CSSProperties> = {
        success: {
            background: 'rgba(34, 197, 94, 0.12)',
            color: theme.colors.success[200],
            border: `1px solid rgba(34, 197, 94, 0.4)`,
        },
        warn: {
            background: 'rgba(249, 115, 22, 0.12)',
            color: theme.colors.warning[300],
            border: `1px solid rgba(249, 115, 22, 0.45)`,
        },
        info: {
            background: 'rgba(59, 130, 246, 0.12)',
            color: theme.colors.pastelBlue[200],
            border: `1px solid rgba(59, 130, 246, 0.45)`,
        },
    }

    const renderStatusChip = (text: string, tone: StatusTone) => (
        <span
            style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '0.15rem 0.65rem',
                borderRadius: theme.radii.pill,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: statusToneStyles[tone].border,
                background: statusToneStyles[tone].background,
                color: statusToneStyles[tone].color,
            }}
        >
            {text}
        </span>
    )

    if (isGuestExperience) {
        const guestFeatureCards = [
            {
                title: 'Profile & presence',
                body: 'Control display name, bio, and the context other teams rely on.',
            },
            {
                title: 'Security center',
                body: 'Turn on MFA, review devices, and lock down recovery paths.',
            },
            {
                title: 'Notification map',
                body: 'Choose which updates reach your inbox and which stay muted.',
            },
            {
                title: 'Provider connections',
                body: 'Link Spotify or YouTube Music to bring catalog signals together.',
            },
        ]

        return (
            <AccountShell>
                <PageHeader
                    title='Account home'
                    description='Preview what you can manage. Sign in to unlock personalized controls.'
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    <Card
                        variant='translucent'
                        style={{
                            background: theme.colors.gradients.hero,
                            border: 'none',
                            color: theme.colors.text,
                            boxShadow: theme.shadows.strong,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.85rem',
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: theme.colors.textMuted,
                                }}
                            >
                                You’re browsing as a guest
                            </p>
                            <h2 style={{ margin: 0, fontSize: '1.9rem' }}>
                                Keep everything secure and in sync from one
                                place.
                            </h2>
                            <p
                                style={{
                                    margin: 0,
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Centralize profile, security, notifications, and
                                provider connections. Sign in when you’re ready
                                to take control.
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem',
                                }}
                            >
                                <Button
                                    onClick={() =>
                                        router.push(ACCOUNT_ROUTES.login)
                                    }
                                >
                                    Sign in
                                </Button>
                                <Button
                                    variant='soft'
                                    tone='neutral'
                                    onClick={() =>
                                        router.push(
                                            DOC_ROUTES.securityHardening,
                                        )
                                    }
                                >
                                    Explore documentation
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <PageSection
                        title='What you can manage'
                        subtitle='Every control lives in one enterprise-ready console.'
                    >
                        <div
                            style={{
                                display: 'grid',
                                gap: '1rem',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(220px, 1fr))',
                            }}
                        >
                            {guestFeatureCards.map((feature) => (
                                <Card key={feature.title} variant='outline'>
                                    <h3 style={{ margin: 0 }}>
                                        {feature.title}
                                    </h3>
                                    <p
                                        style={{
                                            margin: '0.45rem 0 0',
                                            color: theme.colors.textMuted,
                                        }}
                                    >
                                        {feature.body}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </PageSection>

                    <PageSection
                        title='Knowledge base'
                        subtitle='Preview the guides available to signed-in teams.'
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            {KNOWLEDGE_LINKS.map((link) => (
                                <Card
                                    key={link.href}
                                    variant='outline'
                                    padding='md'
                                >
                                    <div>
                                        <h4 style={{ margin: 0 }}>
                                            {link.title}
                                        </h4>
                                        <p
                                            style={{
                                                margin: '0.35rem 0 0',
                                                color: theme.colors.textMuted,
                                            }}
                                        >
                                            {link.description}
                                        </p>
                                    </div>
                                    <Link
                                        href={link.href}
                                        style={{
                                            marginTop: '0.5rem',
                                            color: theme.colors
                                                .accentSecondary[200],
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Read the guide →
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </PageSection>
                </div>
            </AccountShell>
        )
    }

    return (
        <AccountShell>
            <PageHeader
                title='Account home'
                description='Monitor health, jump into workflows, and finish outstanding tasks.'
                actions={
                    <Button
                        onClick={() => router.push(ACCOUNT_ROUTES.security)}
                    >
                        Run security checkup
                    </Button>
                }
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <Card
                    variant='translucent'
                    style={{
                        background: theme.colors.gradients.hero,
                        border: 'none',
                        color: theme.colors.text,
                        boxShadow: theme.shadows.strong,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        <p style={{ margin: 0, color: theme.colors.textMuted }}>
                            Welcome back, {welcomeName}
                        </p>
                        <h2 style={{ margin: 0, fontSize: '1.9rem' }}>
                            Here’s a snapshot of your account health.
                        </h2>
                        <p style={{ margin: 0, color: theme.colors.textMuted }}>
                            Stay ahead of review cycles with quick
                            recommendations tailored to your current setup.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.75rem',
                            }}
                        >
                            <Button
                                onClick={() =>
                                    router.push(ACCOUNT_ROUTES.profile)
                                }
                            >
                                Open profile settings
                            </Button>
                            <Button
                                variant='soft'
                                tone='neutral'
                                onClick={() =>
                                    router.push(ACCOUNT_ROUTES.notifications)
                                }
                            >
                                Notification preferences
                            </Button>
                        </div>
                    </div>
                </Card>

                <div
                    style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(220px, 1fr))',
                    }}
                >
                    {quickActions.map((action) => (
                        <Card key={action.id} variant='outline'>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.6rem',
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: '1.15rem',
                                        }}
                                    >
                                        {action.title}
                                    </h3>
                                    <p
                                        style={{
                                            margin: '0.4rem 0 0',
                                            color: theme.colors.textMuted,
                                        }}
                                    >
                                        {action.description}
                                    </p>
                                </div>
                                <Button
                                    size='sm'
                                    variant={action.primary ? 'solid' : 'soft'}
                                    onClick={() => router.push(action.href)}
                                >
                                    Go to {action.id}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <PageSection
                    title='Status overview'
                    subtitle='Key signals we watch across your account.'
                >
                    <div
                        style={{
                            display: 'grid',
                            gap: '1rem',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(220px, 1fr))',
                        }}
                    >
                        {statusCards.map((card) => (
                            <Card key={card.id} variant='outline'>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                margin: 0,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                fontSize: '0.75rem',
                                                color: theme.colors.textMuted,
                                            }}
                                        >
                                            {card.label}
                                        </p>
                                        <h3
                                            style={{
                                                margin: '0.35rem 0 0',
                                                fontSize: '1.7rem',
                                            }}
                                        >
                                            {card.value}
                                        </h3>
                                    </div>
                                    {renderStatusChip(
                                        card.tone === 'success'
                                            ? 'On track'
                                            : card.tone === 'warn'
                                              ? 'Needs attention'
                                              : 'Planned',
                                        card.tone,
                                    )}
                                </div>
                                <p
                                    style={{
                                        margin: 0,
                                        color: theme.colors.textMuted,
                                    }}
                                >
                                    {card.helper}
                                </p>
                            </Card>
                        ))}
                    </div>
                </PageSection>

                <div
                    style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(280px, 1fr))',
                    }}
                >
                    <PageSection
                        title='Recent activity'
                        subtitle='Latest configuration changes and reviews.'
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            {timelineItems.map((item) => (
                                <Card
                                    key={item.id}
                                    variant='outline'
                                    padding='md'
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ margin: 0 }}>
                                                {item.title}
                                            </h4>
                                            <p
                                                style={{
                                                    margin: '0.35rem 0 0',
                                                    color: theme.colors
                                                        .textMuted,
                                                }}
                                            >
                                                {item.detail}
                                            </p>
                                        </div>
                                        <span
                                            style={{
                                                color: theme.colors.textMuted,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            {item.timestamp}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </PageSection>

                    <PageSection
                        title='Next best actions'
                        subtitle='Knock these out to reach enterprise readiness.'
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.85rem',
                            }}
                        >
                            {recommendedTasks.map((task) => (
                                <Card
                                    key={task.id}
                                    variant='outline'
                                    padding='md'
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '1rem',
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ margin: 0 }}>
                                                {task.title}
                                            </h4>
                                            <p
                                                style={{
                                                    margin: '0.35rem 0 0',
                                                    color: theme.colors
                                                        .textMuted,
                                                }}
                                            >
                                                {task.description}
                                            </p>
                                        </div>
                                        {renderStatusChip(
                                            task.done ? 'Done' : 'Action',
                                            task.done ? 'success' : 'warn',
                                        )}
                                    </div>
                                    <Button
                                        size='sm'
                                        variant='link'
                                        onClick={() => router.push(task.href)}
                                    >
                                        Open{' '}
                                        {ACCOUNT_ROUTE_LABELS[task.href] ||
                                            'account'}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </PageSection>
                </div>

                <PageSection
                    title='Connections health'
                    subtitle='These providers unlock personalized features and catalog ingest.'
                    actions={
                        <Button
                            variant='soft'
                            onClick={() =>
                                router.push(ACCOUNT_ROUTES.connections)
                            }
                        >
                            Manage connections
                        </Button>
                    }
                >
                    {connectionsLoading && connections.length === 0 ? (
                        <p style={{ color: theme.colors.textMuted }}>
                            Loading connections…
                        </p>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gap: '1rem',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(260px, 1fr))',
                            }}
                        >
                            {connections.map((connection) => (
                                <Card
                                    key={connection.provider}
                                    variant='outline'
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '0.5rem',
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ margin: 0 }}>
                                                {connection.name}
                                            </h4>
                                            <p
                                                style={{
                                                    margin: '0.35rem 0 0',
                                                    color: theme.colors
                                                        .textMuted,
                                                }}
                                            >
                                                {connection.description}
                                            </p>
                                        </div>
                                        {renderStatusChip(
                                            connection.connected
                                                ? 'Connected'
                                                : 'Not connected',
                                            connection.connected
                                                ? 'success'
                                                : 'warn',
                                        )}
                                    </div>
                                    {connection.connected &&
                                        connection.username && (
                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: theme.colors
                                                        .textMuted,
                                                }}
                                            >
                                                Synced as {connection.username}
                                            </p>
                                        )}
                                </Card>
                            ))}
                        </div>
                    )}
                    {connectionsError && (
                        <p
                            style={{
                                color: theme.colors.danger[300],
                                marginTop: '0.75rem',
                            }}
                        >
                            {connectionsError}
                        </p>
                    )}
                </PageSection>

                <PageSection
                    title='Knowledge base'
                    subtitle='Deeper dives for your team.'
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        {KNOWLEDGE_LINKS.map((link) => (
                            <Card
                                key={link.href}
                                variant='outline'
                                padding='md'
                            >
                                <div>
                                    <h4 style={{ margin: 0 }}>{link.title}</h4>
                                    <p
                                        style={{
                                            margin: '0.35rem 0 0',
                                            color: theme.colors.textMuted,
                                        }}
                                    >
                                        {link.description}
                                    </p>
                                </div>
                                <Link
                                    href={link.href}
                                    style={{
                                        marginTop: '0.5rem',
                                        color: theme.colors
                                            .accentSecondary[200],
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Read the guide →
                                </Link>
                            </Card>
                        ))}
                    </div>
                </PageSection>
            </div>
        </AccountShell>
    )
}
