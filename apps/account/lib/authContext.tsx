'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiGet, apiPost } from './apiClient'
import type { AuthContextValue, User } from '@mukulasoft/utils'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const me = await apiGet<User>('/me')
                if (!cancelled) setUser(me)
            } catch {
                // ignore initial load failures; explicit auth actions will retry
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    async function login(email: string, password: string) {
        await apiPost<{ user: User }>('/auth/login', { email, password })
        const me = await apiGet<User>('/me')
        setUser(me)
    }

    async function register(email: string, password: string) {
        await apiPost<{ user: User }>('/auth/register', { email, password })
        const me = await apiGet<User>('/me')
        setUser(me)
    }

    async function logout() {
        await apiPost('/auth/logout', {})
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
