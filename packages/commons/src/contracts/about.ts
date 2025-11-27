import { z } from 'zod'

export const aboutSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    headline: z.string().min(4).max(180),
    subheadline: z.string().min(4).max(240),
    body: z.string().min(20).max(4000),
    updatedAt: z.string(),
})

export type AboutPayload = z.infer<typeof aboutSchema>

export const upsertAboutRequestSchema = z.object({
    headline: z.string().min(4).max(180),
    subheadline: z.string().min(4).max(240),
    body: z.string().min(20).max(4000),
})

export type UpsertAboutRequest = z.infer<typeof upsertAboutRequestSchema>
