export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
    readonly status: number
    readonly path: string
    readonly body?: string

    constructor(path: string, status: number, body?: string) {
        super(`Request to ${path} failed with status ${status}`)
        this.name = 'ApiError'
        this.status = status
        this.path = path
        this.body = body
    }
}

function resolveUrl(path: string) {
    if (path.startsWith('http')) return path
    return `${API_BASE}${path}`
}

async function request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(resolveUrl(path), {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
    })

    if (!response.ok) {
        const body = await response.text()
        throw new ApiError(path, response.status, body)
    }

    if (response.status === 204 || response.status === 205) {
        return undefined as T
    }

    return (await response.json()) as T
}

export const httpClient = {
    get: <T>(path: string, init?: RequestInit) =>
        request<T>(path, { method: 'GET', ...(init ?? {}) }),
    post: <T>(path: string, body: unknown, init?: RequestInit) =>
        request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
            ...(init ?? {}),
        }),
    put: <T>(path: string, body: unknown, init?: RequestInit) =>
        request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...(init ?? {}),
        }),
}

export type HttpClient = typeof httpClient
