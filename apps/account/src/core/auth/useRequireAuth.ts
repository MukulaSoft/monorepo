'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'

export function useRequireAuth(redirectTo = '/login') {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.replace(redirectTo)
        }
    }, [loading, redirectTo, router, user])

    return { user, loading }
}
