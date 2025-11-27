'use client'

import Image from 'next/image'
import { Button, Card } from '@mukulasoft/ui'
import {
    catalogProviderLabels,
    catalogProviderOrder,
    type RecommendationResponse,
    type SongRecommendation,
} from '@mukulasoft/utils'
import { ProviderGlyph } from './ProviderGlyph'
import { PreviewPlayer } from './PreviewPlayer'
import styles from '../../styles/RecommendationsList.module.css'

type RecommendationsListProps = {
    recommendations: SongRecommendation[]
    onRefresh?: () => void
    refreshing?: boolean
    canRefresh?: boolean
    metadata?: RecommendationResponse['metadata'] | null
}

export function RecommendationsList({
    recommendations,
    onRefresh,
    refreshing = false,
    canRefresh = true,
    metadata,
}: RecommendationsListProps) {
    return (
        <section className={styles.section}>
            <header className={styles.header}>
                <div>
                    <h3 className={styles.title}>Fresh picks</h3>
                    <p className={styles.description}>
                        Use the provider buttons to open tracks in your
                        preferred player. Preview clips come from whichever
                        catalog source supplied audio snippets.
                    </p>
                    {metadata && (
                        <div className={styles.metadataGroup}>
                            <ResultBadges metadata={metadata} />
                            <small
                                className={`${styles.metadataStatus} ${
                                    metadata.previewCount
                                        ? styles.metadataStatusReady
                                        : styles.metadataStatusPending
                                }`}
                            >
                                {metadata.previewCount > 0
                                    ? `Preview clips ready for ${metadata.previewCount} of ${metadata.total} tracks.`
                                    : "No preview clips for this mix yet—we're still harvesting snippets."}
                            </small>
                        </div>
                    )}
                </div>
                {onRefresh && (
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={onRefresh}
                        disabled={!canRefresh || refreshing}
                        className={styles.refreshButton}
                    >
                        {refreshing ? 'Refreshing…' : 'Refresh results'}
                    </Button>
                )}
            </header>
            <div className={styles.grid}>
                {recommendations.map((rec) => (
                    <Card key={rec.id} className={styles.card}>
                        <div className={styles.cardContent}>
                            <div className={styles.trackRow}>
                                {rec.album.image ? (
                                    <Image
                                        src={rec.album.image}
                                        alt={rec.album.name}
                                        width={64}
                                        height={64}
                                        className={styles.artworkImage}
                                    />
                                ) : (
                                    <div className={styles.artworkFallback}>
                                        ♪
                                    </div>
                                )}
                                <div className={styles.trackInfo}>
                                    <p className={styles.trackTitle}>
                                        {rec.title}
                                    </p>
                                    <p className={styles.trackArtists}>
                                        {rec.artists.join(', ')}
                                    </p>
                                    <small className={styles.trackReason}>
                                        {rec.reason}
                                    </small>
                                    {rec.primaryLinkProvider && (
                                        <div className={styles.primaryProvider}>
                                            <ProviderGlyph
                                                provider={
                                                    rec.primaryLinkProvider
                                                }
                                                compact
                                            />
                                            <small
                                                className={
                                                    styles.primaryProviderLabel
                                                }
                                            >
                                                {
                                                    catalogProviderLabels[
                                                        rec.primaryLinkProvider
                                                    ]
                                                }
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <div className={styles.buttonRow}>
                                    {renderProviderButtons(rec)}
                                </div>
                                {rec.previewUrl && (
                                    <PreviewPlayer url={rec.previewUrl} />
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}

function renderProviderButtons(rec: SongRecommendation) {
    const buttons = catalogProviderOrder
        .filter((provider) => Boolean(rec.links?.[provider]))
        .map((provider) => (
            <Button
                key={`${rec.id}-${provider}`}
                type='button'
                variant='ghost'
                onClick={() =>
                    window.open(
                        rec.links?.[provider] ?? rec.spotifyUrl,
                        '_blank',
                    )
                }
                className={styles.providerButton}
            >
                <span className={styles.providerButtonContent}>
                    <ProviderGlyph provider={provider} compact />
                    <span>Open in {catalogProviderLabels[provider]}</span>
                </span>
            </Button>
        ))

    if (buttons.length > 0) {
        return buttons
    }

    return (
        <Button
            type='button'
            variant='ghost'
            onClick={() => window.open(rec.spotifyUrl, '_blank')}
            className={styles.providerButton}
        >
            Search on Spotify
        </Button>
    )
}

type ResultBadgesProps = {
    metadata: RecommendationResponse['metadata']
}

function ResultBadges({ metadata }: ResultBadgesProps) {
    const badges = [
        {
            label:
                metadata.mode === 'linked' ? 'Personalized' : 'Guest explorer',
            className:
                metadata.mode === 'linked'
                    ? styles.badgeMint
                    : styles.badgeIris,
        },
        {
            label: `Seed: ${metadata.seedType}`,
            className: styles.badgePeach,
        },
        {
            label: `Provider: ${catalogProviderLabels[metadata.seedProvider]}`,
            className: styles.badgeLavender,
        },
        {
            label:
                metadata.tokenSource === 'user'
                    ? 'Linked account'
                    : 'Catalog-only',
            className:
                metadata.tokenSource === 'user'
                    ? styles.badgeMint
                    : styles.badgeIris,
        },
    ]

    return (
        <div className={styles.badges}>
            {badges.map((badge) => (
                <span
                    key={badge.label}
                    className={`${styles.badge} ${badge.className}`}
                >
                    {badge.label}
                </span>
            ))}
        </div>
    )
}
