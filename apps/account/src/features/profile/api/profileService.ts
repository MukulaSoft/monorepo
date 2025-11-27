import type { User } from '@mukulasoft/utils'
import { httpClient } from '@account/core/api/httpClient'

export type UpdateProfilePayload = Pick<User, 'displayName' | 'bio'>

export const profileService = {
    getProfile: () => httpClient.get<User>('/me'),
    updateProfile: (payload: UpdateProfilePayload) =>
        httpClient.put<User>('/me', payload),
}
