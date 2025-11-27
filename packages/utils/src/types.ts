export type User = {
    id: string
    email: string
    displayName: string
    bio: string
    isAdmin: boolean
}

export type Session = {
    token: string
    userId: string
}

export type Project = {
    id: string
    ownerId: string
    slug: string
    title: string
    description: string
    url?: string
    repoUrl?: string
    techStack: string[]
    isPublic: boolean
}

export type About = {
    id: string
    ownerId: string
    headline: string
    subheadline: string
    body: string
    updatedAt: string
}

export type AuthContextValue = {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => void
}

export type RecommendationMode = 'guest' | 'linked'

export type RecommendationSeedType = 'track' | 'playlist'

export type RecommendationRequestPayload = {
    mode: RecommendationMode
    seedType: RecommendationSeedType
    seedUri: string
    limit?: number
}

export type CatalogProviderId = 'spotify' | 'appleMusic' | 'youtubeMusic'

export type SongRecommendation = {
    id: string
    title: string
    artists: string[]
    artistIds: string[]
    album: {
        id: string
        name: string
        image?: string
    }
    previewUrl?: string
    spotifyUrl: string
    links: Partial<Record<CatalogProviderId, string>>
    primaryLinkProvider: CatalogProviderId | null
    score: number
    reason: string
    source: string
}

export type RecommendationResponse = {
    recommendations: SongRecommendation[]
    metadata: {
        seedType: RecommendationSeedType
        seedId: string
        seedProvider: CatalogProviderId
        mode: RecommendationMode
        tokenSource: 'guest' | 'user'
        previewCount: number
        total: number
    }
}

export type CatalogTrackMetadata = {
    id: string
    title: string
    artists: string[]
    album: string
    artwork: string
    popularity: number
    previewUrl?: string
    providers: Partial<Record<CatalogProviderId, string>>
    features: {
        energy: number
        valence: number
        danceability: number
        acousticness: number
        instrumentalness: number
        liveness: number
        speechiness: number
        tempo: number
    }
    tags: string[]
}

export type CatalogPlaylistMetadata = {
    id: string
    name: string
    providerRefs: { provider: CatalogProviderId; id: string }[]
    trackIds: string[]
}

export type CatalogMetadataRequestItem = {
    type: RecommendationSeedType
    provider: CatalogProviderId
    id: string
}

export type CatalogMetadataResponseItem =
    | {
          type: 'track'
          request: CatalogMetadataRequestItem
          metadata: CatalogTrackMetadata | null
      }
    | {
          type: 'playlist'
          request: CatalogMetadataRequestItem
          metadata:
              | (CatalogPlaylistMetadata & {
                    tracks: CatalogTrackMetadata[]
                })
              | null
      }

export type CatalogMetadataResponse = {
    results: CatalogMetadataResponseItem[]
}

export type CatalogSearchResult =
    | {
          type: 'track'
          id: string
          title: string
          subtitle: string
          provider: CatalogProviderId
          providerId: string
          artwork?: string
          tags: string[]
          seedUri: string
      }
    | {
          type: 'playlist'
          id: string
          title: string
          subtitle: string
          provider: CatalogProviderId
          providerId: string
          trackCount: number
          seedUri: string
      }

export type CatalogSearchResponse = {
    query: string
    results: CatalogSearchResult[]
}
