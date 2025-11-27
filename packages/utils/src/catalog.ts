import type { CatalogProviderId } from './types'

export const catalogProviderLabels: Record<CatalogProviderId, string> = {
    spotify: 'Spotify',
    appleMusic: 'Apple Music',
    youtubeMusic: 'YouTube Music',
}

export const catalogProviderOrder: CatalogProviderId[] = [
    'spotify',
    'appleMusic',
    'youtubeMusic',
]

export type CatalogProviderMeta = {
    label: string
    icon: string
    accent: string
}

export const catalogProviderMeta: Record<
    CatalogProviderId,
    CatalogProviderMeta
> = {
    spotify: {
        icon: '🟢',
        accent: '#1db954',
        label: catalogProviderLabels.spotify,
    },
    appleMusic: {
        icon: '🎧',
        accent: '#fc3c44',
        label: catalogProviderLabels.appleMusic,
    },
    youtubeMusic: {
        icon: '▶️',
        accent: '#ff4f4f',
        label: catalogProviderLabels.youtubeMusic,
    },
}

export const connectionIcons: Record<string, { icon: string; accent: string }> =
    {
        spotify: { icon: '🟢', accent: '#1db954' },
        youtube: { icon: '▶️', accent: '#ff4f4f' },
    }

export function getCatalogProviderMeta(
    provider: CatalogProviderId,
): CatalogProviderMeta {
    return catalogProviderMeta[provider]
}

export function formatCatalogProvider(provider: CatalogProviderId): string {
    return catalogProviderLabels[provider] ?? provider
}

export function sortProviders(
    providers: CatalogProviderId[],
): CatalogProviderId[] {
    return [...providers].sort((a, b) => {
        return catalogProviderOrder.indexOf(a) - catalogProviderOrder.indexOf(b)
    })
}
