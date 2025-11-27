import { z } from 'zod'

export const meProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    bio: z.string(),
    isAdmin: z.boolean(),
})

export type MeProfile = z.infer<typeof meProfileSchema>

export const updateMeRequestSchema = z.object({
    displayName: z.string().min(2).max(80).optional(),
    bio: z.string().max(500).optional(),
})

export type UpdateMeRequest = z.infer<typeof updateMeRequestSchema>
