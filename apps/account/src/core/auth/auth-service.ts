import type { User } from '@mukulasoft/utils'
import { httpClient } from '../api/httpClient'

export const authService = {
    me: () => httpClient.get<User>('/me'),
    login: (email: string, password: string) =>
        httpClient.post<{ user: User }>('/auth/login', { email, password }),
    register: (email: string, password: string) =>
        httpClient.post<{ user: User }>('/auth/register', { email, password }),
    logout: () => httpClient.post('/auth/logout', {}),
}
