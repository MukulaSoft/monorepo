'use client'

import Link from 'next/link'
import { useState, type FormEvent, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, Field, useTheme } from '@mukulasoft/ui'
import { useAuth } from '@account/core/auth/auth-context'
import { AccountShell } from '@account/shared/layout/AccountShell'
import { ACCOUNT_ROUTES, DOC_ROUTES } from '@account/core/config/routes'

type AuthMode = 'login' | 'register'

const FEATURE_CALLOUTS = [
    {
        title: 'Unified security controls',
        detail: 'Passkeys, MFA, and device approvals in one dashboard.',
    },
    {
        title: 'Provider-grade privacy',
        detail: 'Granular scopes when connecting Spotify or YouTube Music.',
    },
    {
        title: 'Real-time notifications',
        detail: 'Route incidents to inbox, SMS, or Slack instantly.',
    },
]

const SUPPORT_LINKS = [
    {
        title: 'Having trouble signing in?',
        description: 'Review recovery options and regional availability.',
        href: DOC_ROUTES.accountAccessHelp,
    },
    {
        title: 'Security center tour',
        description: 'See how we store credentials and audit access.',
        href: '/docs/security/overview',
    },
]

const MODE_COPY: Record<
    AuthMode,
    { title: string; subtitle: string; cta: string }
> = {
    login: {
        title: 'Welcome back',
        subtitle: 'Enter your credentials to resume where you left off.',
        cta: 'Sign in',
    },
    register: {
        title: 'Create your account',
        subtitle: 'Set up access so you can manage security and signals.',
        cta: 'Create account',
    },
}

export default function LoginPage() {
    const theme = useTheme()
    const { login, register } = useAuth()
    const router = useRouter()
    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'login') {
                await login(email, password)
            } else {
                await register(email, password)
            }
            router.push(ACCOUNT_ROUTES.home)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const currentCopy = MODE_COPY[mode]

    const layoutStyles: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%',
        alignItems: 'stretch',
    }

    const heroCardStyle: CSSProperties = {
        border: '1px solid rgba(255,255,255,0.08)',
        background:
            'radial-gradient(circle at 10% 20%, rgba(99,102,241,0.35), transparent 55%), radial-gradient(circle at 90% 0%, rgba(45,212,191,0.25), transparent 45%), rgba(4,7,26,0.85)',
        boxShadow: '0 30px 60px rgba(2,6,23,0.6)',
        padding: '2.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.65rem',
        borderRadius: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
    }

    const heroChipStyle: CSSProperties = {
        padding: '0.4rem 0.9rem',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.14)',
        backgroundColor: 'rgba(15,23,42,0.3)',
        fontSize: '0.85rem',
        letterSpacing: '0.02em',
    }

    const authCardStyle: CSSProperties = {
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(3,7,18,0.82)',
        boxShadow: '0 30px 45px rgba(2,6,23,0.55)',
        backdropFilter: 'blur(18px)',
        borderRadius: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
    }

    const toggleButtonStyles = (active: boolean): CSSProperties => ({
        flex: 1,
        padding: '0.65rem 1rem',
        borderRadius: '0.85rem',
        border: active
            ? `1px solid ${theme.colors.accent}`
            : `1px solid rgba(255,255,255,0.08)`,
        background: active
            ? 'linear-gradient(120deg, rgba(59,130,246,0.8), rgba(45,212,191,0.8))'
            : 'transparent',
        color: active ? theme.colors.text : theme.colors.textMuted,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 150ms ease',
    })

    const inputStyle: CSSProperties = {
        backgroundColor: 'rgba(15,23,42,0.85)',
        borderColor: 'rgba(255,255,255,0.15)',
    }

    const ssoProviders = [
        { label: 'Continue with Google', id: 'google' },
        { label: 'Continue with GitHub', id: 'github' },
    ]

    return (
        <AccountShell>
            <div style={layoutStyles}>
                <Card variant='translucent' style={heroCardStyle}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        <p
                            style={{
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                fontSize: '0.8rem',
                                margin: 0,
                                color: theme.colors.textMuted,
                            }}
                        >
                            Account platform
                        </p>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: '2.5rem',
                                lineHeight: 1.2,
                            }}
                        >
                            Secure sign-in for the entire studio workflow.
                        </h1>
                        <p
                            style={{
                                margin: 0,
                                color: theme.colors.textMuted,
                                maxWidth: 520,
                            }}
                        >
                            Centralize security, streaming connections, and
                            notification policies. Log in to unlock personalized
                            insights or create your seat in under a minute.
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {FEATURE_CALLOUTS.map((feature) => (
                            <Card
                                key={feature.title}
                                variant='outline'
                                padding='lg'
                                style={{
                                    backgroundColor: 'rgba(8,15,35,0.65)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '1.1rem',
                                }}
                            >
                                <h3 style={{ margin: 0 }}>{feature.title}</h3>
                                <p
                                    style={{
                                        margin: '0.5rem 0 0',
                                        color: theme.colors.textMuted,
                                    }}
                                >
                                    {feature.detail}
                                </p>
                            </Card>
                        ))}
                    </div>
                    <div>
                        <p
                            style={{
                                margin: '0 0 0.35rem',
                                color: theme.colors.textMuted,
                            }}
                        >
                            Trusted by teams shipping on
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.65rem',
                                flexWrap: 'wrap',
                                fontWeight: 600,
                            }}
                        >
                            {['Spotify Labs', 'YouTube Music', 'IndieWave'].map(
                                (label) => (
                                    <span key={label} style={heroChipStyle}>
                                        {label}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                </Card>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                    }}
                >
                    <Card padding='lg' style={authCardStyle}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['login', 'register'] as AuthMode[]).map(
                                (authMode) => {
                                    const active = authMode === mode
                                    return (
                                        <button
                                            key={authMode}
                                            type='button'
                                            onClick={() => setMode(authMode)}
                                            aria-pressed={active}
                                            style={toggleButtonStyles(active)}
                                        >
                                            {authMode === 'login'
                                                ? 'Sign in'
                                                : 'Create account'}
                                        </button>
                                    )
                                },
                            )}
                        </div>
                        <div>
                            <h2 style={{ margin: '0 0 0.35rem' }}>
                                {currentCopy.title}
                            </h2>
                            <p
                                style={{
                                    margin: 0,
                                    color: theme.colors.textMuted,
                                }}
                            >
                                {currentCopy.subtitle}
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <Field label='Email' required htmlFor='email'>
                                <Input
                                    id='email'
                                    type='email'
                                    autoComplete='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label='Password' required htmlFor='password'>
                                <Input
                                    id='password'
                                    type='password'
                                    autoComplete={
                                        mode === 'login'
                                            ? 'current-password'
                                            : 'new-password'
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    style={inputStyle}
                                />
                            </Field>

                            {error && (
                                <div
                                    role='alert'
                                    style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.65rem',
                                        backgroundColor:
                                            'rgba(248,113,113,0.08)',
                                        border: `1px solid ${theme.colors.danger[500]}`,
                                        color: theme.colors.danger[200],
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.85rem',
                                }}
                            >
                                <Button type='submit' disabled={loading}>
                                    {loading ? 'Working…' : currentCopy.cta}
                                </Button>
                            </div>
                        </form>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.85rem',
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Prefer single sign-on?
                            </span>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.6rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {ssoProviders.map((provider) => (
                                    <Button
                                        key={provider.id}
                                        type='button'
                                        variant='soft'
                                        tone='neutral'
                                        style={{
                                            flex: 1,
                                            minWidth: 160,
                                            backgroundColor:
                                                'rgba(15,23,42,0.55)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}
                                        disabled
                                    >
                                        {provider.label}
                                    </Button>
                                ))}
                            </div>
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Enterprise SSO is provisioned in production
                                tenants.
                            </span>
                        </div>
                    </Card>

                    <Card
                        variant='outline'
                        padding='lg'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        {SUPPORT_LINKS.map((link) => (
                            <div key={link.href}>
                                <h3 style={{ margin: 0 }}>{link.title}</h3>
                                <p
                                    style={{
                                        margin: '0.35rem 0',
                                        color: theme.colors.textMuted,
                                    }}
                                >
                                    {link.description}
                                </p>
                                <Link
                                    href={link.href}
                                    style={{
                                        color: theme.colors
                                            .accentSecondary[200],
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    Open guide →
                                </Link>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </AccountShell>
    )
}
