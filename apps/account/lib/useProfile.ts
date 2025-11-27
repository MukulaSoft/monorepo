'use client'

import { useEffect, useState } from 'react'
import { apiGet } from './apiClient'
import type { User } from '@mukulasoft/utils'

export function useProfile() {
    const [data, setData] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const profile = await apiGet<User>('/me')
                if (!cancelled) {
                    setData(profile)
                }
            } catch (err) {
                if (!cancelled) {
                    setError((err as Error).message)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return { data, loading, error }
}
