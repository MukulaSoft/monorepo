'use client'

import { FormEvent } from 'react'
import { Card, Button, Input, TextArea, Field } from '@mukulasoft/ui'
import { AccountSettingsLayout } from '@account/shared/layout/AccountSettingsLayout'
import { PageHeader } from '@account/shared/components/PageHeader'
import { useRequireAuth } from '@account/core/auth/useRequireAuth'
import { useProfileQuery } from '../hooks/useProfileQuery'
import { useProfileForm } from '../hooks/useProfileForm'

export function ProfileSettingsScreen() {
    const { user, loading: authLoading } = useRequireAuth()
    const { data, loading: profileLoading, error } = useProfileQuery()
    const form = useProfileForm(data)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        try {
            await form.save()
        } catch {
            // error surface handled via form.status
        }
    }

    const disabled = profileLoading || form.saving || !user || authLoading

    return (
        <AccountSettingsLayout>
            <PageHeader
                title='Profile'
                description='Update the details that appear on your public profile.'
            />

            <Card>
                {profileLoading && <p>Loading profile…</p>}
                {error && (
                    <p style={{ color: '#c0392b', margin: 0 }}>
                        Error loading profile: {error}
                    </p>
                )}
                {data && !error && (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            maxWidth: 720,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin: 0,
                                        color: '#6c7a90',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Account email
                                </p>
                                <p
                                    style={{
                                        margin: '0.15rem 0 0',
                                        fontWeight: 600,
                                    }}
                                >
                                    {data.email}
                                </p>
                            </div>
                            {form.status && (
                                <p
                                    role='status'
                                    aria-live='polite'
                                    style={{
                                        margin: 0,
                                        color: form.status.startsWith(
                                            'Could not',
                                        )
                                            ? '#c0392b'
                                            : '#0f9d58',
                                        fontWeight: 600,
                                    }}
                                >
                                    {form.status}
                                </p>
                            )}
                        </div>

                        <Field label='Display name' htmlFor='displayName'>
                            <Input
                                id='displayName'
                                type='text'
                                value={form.values.displayName}
                                onChange={(e) =>
                                    form.updateField(
                                        'displayName',
                                        e.target.value,
                                    )
                                }
                                placeholder='How should we address you?'
                                disabled={disabled}
                            />
                        </Field>

                        <Field
                            label='Bio'
                            htmlFor='bio'
                            hint='A short line about you that appears on your public profile.'
                        >
                            <TextArea
                                id='bio'
                                value={form.values.bio}
                                onChange={(e) =>
                                    form.updateField('bio', e.target.value)
                                }
                                rows={3}
                                disabled={disabled}
                                placeholder='Work, interests, or a tagline.'
                            />
                        </Field>

                        <div
                            style={{
                                marginTop: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button
                                    type='submit'
                                    disabled={!form.hasChanges || form.saving}
                                >
                                    {form.saving
                                        ? 'Saving…'
                                        : form.hasChanges
                                          ? 'Save changes'
                                          : 'Saved'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={form.reset}
                                    disabled={!form.hasChanges || form.saving}
                                >
                                    Reset
                                </Button>
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    color: '#6c7a90',
                                    fontSize: '0.95rem',
                                }}
                            >
                                Keep this information up to date so teammates
                                know who&apos;s behind the account.
                            </p>
                        </div>
                    </form>
                )}
            </Card>
        </AccountSettingsLayout>
    )
}
