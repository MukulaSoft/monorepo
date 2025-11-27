type FetchImpl = typeof fetch

export type ApiClientOptions = {
    baseUrl: string
    credentials?: RequestCredentials
    fetchImpl?: FetchImpl
    defaultHeaders?: Record<string, string>
}

export type ApiClient = {
    get<T>(path: string, init?: RequestInit): Promise<T>
    post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>
    put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>
    delete<T>(path: string, init?: RequestInit): Promise<T>
}

function buildUrl(baseUrl: string, path: string) {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }
    return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}

async function parseJson<T>(res: Response): Promise<T> {
    if (res.status === 204 || res.status === 205) {
        return undefined as T
    }
    const text = await res.text()
    try {
        return JSON.parse(text) as T
    } catch {
        throw new Error(`Failed to parse JSON response: ${text.slice(0, 120)}`)
    }
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const detail = await res.text()
        throw new Error(
            `Request failed with ${res.status}: ${detail.slice(0, 200)}`,
        )
    }
    return parseJson<T>(res)
}

export function createApiClient(options: ApiClientOptions): ApiClient {
    const fetchFn = options.fetchImpl ?? fetch
    const credentials = options.credentials ?? 'include'

    async function request<T>(
        method: string,
        path: string,
        body?: unknown,
        init: RequestInit = {},
    ) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.defaultHeaders ?? {}),
            ...(init.headers as Record<string, string> | undefined),
        }

        const response = await fetchFn(buildUrl(options.baseUrl, path), {
            ...init,
            method,
            credentials,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })

        return handleResponse<T>(response)
    }

    return {
        get: (path, init) => request('GET', path, undefined, init),
        post: (path, body, init) => request('POST', path, body, init),
        put: (path, body, init) => request('PUT', path, body, init),
        delete: (path, init) => request('DELETE', path, undefined, init),
    }
}
