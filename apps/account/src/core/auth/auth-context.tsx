'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthContextValue, User } from '@mukulasoft/utils'
import { authService } from './auth-service'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const me = await authService.me()
                if (!cancelled) setUser(me)
            } catch {
                // silent failure; explicit auth actions will report errors
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    async function login(email: string, password: string) {
        await authService.login(email, password)
        const me = await authService.me()
        setUser(me)
    }

    async function register(email: string, password: string) {
        await authService.register(email, password)
        const me = await authService.me()
        setUser(me)
    }

    async function logout() {
        await authService.logout()
        setUser(null)
    }

    const value = useMemo<AuthContextValue>(
        () => ({ user, loading, login, register, logout }),
        [user, loading],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
