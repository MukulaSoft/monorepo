import {
    type AccountConnection,
    type ConnectionProvider,
} from '@mukulasoft/utils'
import { API_BASE, httpClient } from '@account/core/api/httpClient'

export const connectionsService = {
    list: () =>
        httpClient.get<{ connections: AccountConnection[] }>('/connections'),
    update: (provider: ConnectionProvider, connected: boolean) =>
        httpClient.put<{ connection: AccountConnection }>(
            `/connections/${provider}`,
            { connected },
        ),
}

export function buildAuthorizeUrl(
    provider: ConnectionProvider,
    returnTo: string,
) {
    const authorizeUrl = new URL(
        `${API_BASE}/connections/${provider}/authorize`,
    )
    authorizeUrl.searchParams.set('returnTo', returnTo)
    return authorizeUrl.toString()
}
