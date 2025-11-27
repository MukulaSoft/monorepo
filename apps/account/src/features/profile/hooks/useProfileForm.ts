'use client'

import { useEffect, useState } from 'react'
import type { User } from '@mukulasoft/utils'
import { profileService } from '../api/profileService'

type ProfileFormState = {
    displayName: string
    bio: string
}

function normalize(user: User | null): ProfileFormState {
    return {
        displayName: user?.displayName?.trim() ?? '',
        bio: user?.bio?.trim() ?? '',
    }
}

export function useProfileForm(user: User | null) {
    const [values, setValues] = useState<ProfileFormState>(normalize(user))
    const [initialValues, setInitialValues] = useState<ProfileFormState>(
        normalize(user),
    )
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        const nextValues = normalize(user)
        setValues(nextValues)
        setInitialValues(nextValues)
        setStatus(null)
    }, [user])

    const hasChanges =
        values.displayName.trim() !== initialValues.displayName ||
        values.bio.trim() !== initialValues.bio

    function updateField<K extends keyof ProfileFormState>(
        key: K,
        value: string,
    ) {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    async function save() {
        if (!hasChanges) return
        setSaving(true)
        setStatus(null)
        try {
            const payload = {
                displayName: values.displayName.trim(),
                bio: values.bio.trim(),
            }
            await profileService.updateProfile(payload)
            setInitialValues(payload)
            setValues(payload)
            setStatus('Changes saved')
        } catch (err) {
            setStatus(`Could not save: ${(err as Error).message}`)
            throw err
        } finally {
            setSaving(false)
        }
    }

    function reset() {
        setValues(initialValues)
        setStatus(null)
    }

    return {
        values,
        saving,
        status,
        hasChanges,
        updateField,
        save,
        reset,
    }
}
