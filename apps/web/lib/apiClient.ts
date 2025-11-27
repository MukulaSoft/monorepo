export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

export async function apiGet<T>(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: 'include',
    })

    if (!res.ok) {
        throw new Error(`API GET ${path} failed with ${res.status}`)
    }

    return (await res.json()) as T
}

export async function apiPost<T>(
    path: string,
    body: unknown,
    options: RequestInit = {},
) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const text = await res.text()
        let detail = text.slice(0, 200)
        try {
            const json = JSON.parse(text)
            if (json?.message) {
                detail = json.message
            }
        } catch {
            // ignore parse errors
        }
        throw new Error(`API POST ${path} failed with ${res.status}: ${detail}`)
    }

    if (res.status === 204) {
        return undefined as T
    }

    return (await res.json()) as T
}
