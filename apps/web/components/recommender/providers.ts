import type { CatalogProviderId } from '@mukulasoft/utils'

export const providerLabels: Record<CatalogProviderId, string> = {
    spotify: 'Spotify',
    appleMusic: 'Apple Music',
    youtubeMusic: 'YouTube Music',
}

export const providerOrder: CatalogProviderId[] = [
    'spotify',
    'appleMusic',
    'youtubeMusic',
]

export const providerIcons: Record<
    CatalogProviderId,
    { icon: string; accent: string }
> = {
    spotify: { icon: '🟢', accent: '#1db954' },
    appleMusic: { icon: '🎧', accent: '#fc3c44' },
    youtubeMusic: { icon: '▶️', accent: '#ff4f4f' },
}

export const connectionIcons: Record<string, { icon: string; accent: string }> =
    {
        spotify: { icon: '🟢', accent: '#1db954' },
        youtube: { icon: '▶️', accent: '#ff4f4f' },
    }
