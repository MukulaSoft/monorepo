'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button, Card, Field, Input } from '@mukulasoft/ui'
import { useSecuritySettings } from '../hooks/useSecuritySettings'

const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
}

const listStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'grid',
    gap: '0.35rem',
}

export function SecuritySettingsContent() {
    const {
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
        reload,
        dismissRecoveryBundle,
    } = useSecuritySettings()

    const [verificationCode, setVerificationCode] = useState('')

    const twoFactor = settings?.twoFactor
    const enabled = Boolean(twoFactor?.enabled)

    const recoveryCount = twoFactor?.recoveryCodesRemaining ?? 0
    const confirmedLabel = useMemo(() => {
        if (!twoFactor?.confirmedAt) return 'Not enrolled yet'
        return new Date(twoFactor.confirmedAt).toLocaleString()
    }, [twoFactor?.confirmedAt])

    if (loading) {
        return <Card>Loading security controls…</Card>
    }

    if (error) {
        return (
            <Card>
                <p style={{ marginTop: 0 }}>{error}</p>
                <Button onClick={() => reload()} variant='soft'>
                    Retry
                </Button>
            </Card>
        )
    }

    const actionDisabled = Boolean(pendingAction)
    const showEnrollment = Boolean(enrollment)

    return (
        <div style={containerStyle}>
            <Card>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}
                >
                    <header>
                        <p
                            style={{
                                margin: 0,
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                letterSpacing: 0.6,
                                color: '#6f7b95',
                            }}
                        >
                            Two-factor authentication
                        </p>
                        <h2
                            style={{
                                margin: '0.1rem 0 0.4rem',
                                fontSize: '1.45rem',
                            }}
                        >
                            {enabled
                                ? 'Two-factor is active'
                                : 'Add a second step to sign in'}
                        </h2>
                        <p style={{ margin: 0, color: '#7f8ca3' }}>
                            Recovery codes remaining: {recoveryCount}. Last
                            confirmed: {confirmedLabel}.
                        </p>
                    </header>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                        }}
                    >
                        {enabled ? (
                            <>
                                <Button
                                    variant='soft'
                                    onClick={() => regenerateCodes()}
                                    loading={pendingAction === 'regenerate'}
                                    disabled={actionDisabled}
                                >
                                    Generate new recovery codes
                                </Button>
                                <Button
                                    tone='danger'
                                    variant='outline'
                                    onClick={() => disableTwoFactor()}
                                    loading={pendingAction === 'disable'}
                                    disabled={pendingAction === 'disable'}
                                >
                                    Disable 2FA
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => startEnrollment()}
                                loading={pendingAction === 'prepare'}
                                disabled={actionDisabled}
                            >
                                Start setup
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {showEnrollment && enrollment && (
                <Card>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <header>
                            <h3 style={{ margin: 0 }}>Finish 2FA enrollment</h3>
                            <p
                                style={{
                                    margin: '0.3rem 0 0',
                                    color: '#7f8ca3',
                                }}
                            >
                                Add this secret to your authenticator app, then
                                enter a 6-digit code before it expires.
                            </p>
                        </header>
                        <Field
                            label='Secret key'
                            required
                            htmlFor='twofactor-secret'
                        >
                            <Input
                                id='twofactor-secret'
                                readOnly
                                value={enrollment.secret}
                                onFocus={(event) =>
                                    event.currentTarget.select()
                                }
                            />
                        </Field>
                        <Field
                            label='OTP URI'
                            hint='Copy this into a QR generator if you need a scannable code.'
                        >
                            <Input
                                readOnly
                                value={enrollment.otpAuthUrl}
                                onFocus={(event) =>
                                    event.currentTarget.select()
                                }
                            />
                        </Field>
                        <Field
                            label='Verification code'
                            required
                            htmlFor='twofactor-code'
                        >
                            <Input
                                id='twofactor-code'
                                value={verificationCode}
                                onChange={(event) =>
                                    setVerificationCode(event.target.value)
                                }
                                placeholder='123456'
                                inputMode='numeric'
                                maxLength={12}
                            />
                        </Field>
                        <div style={{ display: 'flex', gap: '0.65rem' }}>
                            <Button
                                onClick={() =>
                                    confirmEnrollment(verificationCode.trim())
                                }
                                disabled={
                                    verificationCode.trim().length < 6 ||
                                    actionDisabled
                                }
                                loading={pendingAction === 'confirm'}
                            >
                                Confirm 2FA
                            </Button>
                            <Button
                                variant='ghost'
                                onClick={() => setVerificationCode('')}
                                disabled={!verificationCode}
                            >
                                Clear
                            </Button>
                        </div>
                        <p
                            style={{
                                margin: 0,
                                color: '#7f8ca3',
                                fontSize: '0.9rem',
                            }}
                        >
                            Enrollment expires at{' '}
                            {new Date(
                                enrollment.expiresAt,
                            ).toLocaleTimeString()}
                            .
                        </p>
                    </div>
                </Card>
            )}

            {recoveryBundle && (
                <Card>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.9rem',
                        }}
                    >
                        <header>
                            <h3 style={{ margin: 0 }}>
                                Store these recovery codes
                            </h3>
                            <p
                                style={{
                                    margin: '0.3rem 0 0',
                                    color: '#7f8ca3',
                                }}
                            >
                                Save them somewhere offline. Each code works
                                only once and regenerating replaces the full
                                list.
                            </p>
                        </header>
                        <ul style={listStyle}>
                            {recoveryBundle.codes.map((code) => (
                                <li key={code}>
                                    <code
                                        style={{
                                            fontSize: '1.1rem',
                                            letterSpacing: 2,
                                        }}
                                    >
                                        {code}
                                    </code>
                                </li>
                            ))}
                        </ul>
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.65rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Button
                                variant='soft'
                                onClick={() => copyCodes(recoveryBundle.codes)}
                            >
                                Copy all codes
                            </Button>
                            <Button
                                variant='ghost'
                                onClick={dismissRecoveryBundle}
                            >
                                Hide list
                            </Button>
                        </div>
                        <p
                            style={{
                                margin: 0,
                                color: '#7f8ca3',
                                fontSize: '0.85rem',
                            }}
                        >
                            Generated{' '}
                            {new Date(
                                recoveryBundle.generatedAt,
                            ).toLocaleString()}
                            .
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}

async function copyCodes(codes: string[]) {
    try {
        await navigator.clipboard.writeText(codes.join('\n'))
    } catch (err) {
        console.warn('Unable to copy recovery codes', err)
    }
}
