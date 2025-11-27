import {
    catalogProviderMeta,
    connectionIcons,
    type CatalogProviderId,
} from '@mukulasoft/utils'
import styles from '../../styles/ProviderGlyph.module.css'

const providerClassMap: Record<string, string | undefined> = {
    spotify: styles.spotify,
    appleMusic: styles.appleMusic,
    youtubeMusic: styles.youtubeMusic,
    youtube: styles.youtube,
}

export function ProviderGlyph({
    provider,
    compact = false,
}: {
    provider: CatalogProviderId
    compact?: boolean
}) {
    const meta = catalogProviderMeta[provider]
    if (!meta) return null
    const className = [
        styles.glyph,
        compact ? styles.compact : '',
        providerClassMap[provider],
    ]
        .filter(Boolean)
        .join(' ')
    return <span className={className}>{meta.icon}</span>
}

export function ConnectionGlyph({ provider }: { provider: string }) {
    const meta = connectionIcons[provider] ?? { icon: '🎵', accent: '#9fb8ff' }
    const className = [styles.glyph, providerClassMap[provider]]
        .filter(Boolean)
        .join(' ')
    return <span className={className}>{meta.icon}</span>
}
