'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card } from '@mukulasoft/ui'
import {
    type AccountConnection,
    type CatalogSearchResult,
    type CatalogSearchResponse,
    type RecommendationMode,
    type RecommendationResponse,
    type RecommendationSeedType,
    type SongRecommendation,
} from '@mukulasoft/utils'
import { useAuth } from '../lib/authContext'
import { apiGet, apiPost } from '../lib/apiClient'
import { AuthCard } from './recommender/AuthCard'
import { RecommendationsList } from './recommender/RecommendationsList'
import { RecommendationsSkeleton } from './recommender/RecommendationsSkeleton'
import {
    CatalogSearchPanel,
    HiddenSeedInput,
    type SelectedSeedSummary,
} from './recommender/CatalogSearchPanel'
import { SeedControls } from './recommender/SeedControls'
import styles from '../styles/RecommenderClient.module.css'

type RecommendationPayload = {
    mode: RecommendationMode
    seedType: RecommendationSeedType
    seedUri: string
    limit: number
}

export function RecommenderClient() {
    const { user, loading: authLoading } = useAuth()
    const [mode, setMode] = useState<RecommendationMode>('guest')
    const [seedType, setSeedType] = useState<RecommendationSeedType>('track')
    const [seedUri, setSeedUri] = useState('')
    const [limit, setLimit] = useState(20)
    const [recommendations, setRecommendations] = useState<
        SongRecommendation[]
    >([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [connections, setConnections] = useState<AccountConnection[] | null>(
        null,
    )
    const [lastRequest, setLastRequest] =
        useState<RecommendationPayload | null>(null)
    const [resultMeta, setResultMeta] = useState<
        RecommendationResponse['metadata'] | null
    >(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<CatalogSearchResult[]>(
        [],
    )
    const [selectedSeed, setSelectedSeed] =
        useState<SelectedSeedSummary | null>(null)
    const [searching, setSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)
    const [selectedSearchId, setSelectedSearchId] = useState<string | null>(
        null,
    )
    const skipSeedReset = useRef(false)
    const [viewMode, setViewMode] = useState<'builder' | 'results'>('builder')
    const [activeSeedLabel, setActiveSeedLabel] = useState('')

    const spotifyConnected = useMemo(() => {
        return connections?.some(
            (connection) =>
                connection.provider === 'spotify' && connection.connected,
        )
    }, [connections])

    const youtubeConnected = useMemo(() => {
        return connections?.some(
            (connection) =>
                connection.provider === 'youtube' && connection.connected,
        )
    }, [connections])

    const canUseLinkedMode = Boolean(
        user && (spotifyConnected || youtubeConnected),
    )

    const linkedProviderLabels = useMemo(() => {
        const labels: string[] = []
        if (spotifyConnected) labels.push('Spotify')
        if (youtubeConnected) labels.push('YouTube')
        return labels
    }, [spotifyConnected, youtubeConnected])

    const personalizedLabel = linkedProviderLabels.length
        ? `My linked taste (${linkedProviderLabels.join(' + ')})`
        : 'My linked taste'

    const linkedHelper = !user
        ? 'Sign in to unlock personalized mixes.'
        : !canUseLinkedMode
          ? 'Link Spotify or YouTube at account/connections.'
          : null

    useEffect(() => {
        if (!user) {
            setConnections(null)
            setLoading(false)
            return
        }
        let cancelled = false
        setLoading(true)
        ;(async () => {
            try {
                const data = await apiGet<{ connections: AccountConnection[] }>(
                    '/connections',
                )
                if (!cancelled) setConnections(data.connections)
            } catch (err) {
                console.warn('Failed to load connections', err)
                if (!cancelled) setConnections(null)
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [user])

    useEffect(() => {
        if (skipSeedReset.current) {
            skipSeedReset.current = false
            return
        }
        setSeedUri('')
        setSearchTerm('')
        setSelectedSearchId(null)
        setSelectedSeed(null)
    }, [seedType])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([])
            setSearching(false)
            setSearchError(null)
            return
        }
        if (searchTerm.trim().length < 2) {
            setSearchResults([])
            setSearchError(null)
            return
        }

        setSearching(true)
        setSearchError(null)
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                const params = new URLSearchParams({
                    q: searchTerm.trim(),
                    type: seedType,
                })
                const data = await apiGet<CatalogSearchResponse>(
                    `/music/search?${params.toString()}`,
                    { signal: controller.signal },
                )
                setSearchResults(data.results)
            } catch (err) {
                if ((err as Error).name === 'AbortError') return
                console.warn('Search failed', err)
                setSearchError(
                    'Search temporarily unavailable. Try again in a moment.',
                )
            } finally {
                setSearching(false)
            }
        }, 250)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [searchTerm, seedType])

    async function requestRecommendations(
        payload: RecommendationPayload,
        action: 'submit' | 'refresh' = 'submit',
    ) {
        setError(null)
        if (action === 'submit') {
            setRecommendations([])
            setResultMeta(null)
        }
        setLoading(true)
        if (action === 'refresh') {
            setRefreshing(true)
        }

        try {
            const response = await apiPost<RecommendationResponse>(
                '/music/recommendations',
                payload,
            )
            setRecommendations(response.recommendations)
            setResultMeta(response.metadata)
            setLastRequest(payload)
        } catch (err) {
            console.error(err)
            const friendly = parseError(err)
            setError(
                friendly ??
                    (payload.mode === 'linked'
                        ? "Your linked account isn't ready for this seed yet. Try reconnecting at /account/connections or use guest mode."
                        : "That seed isn't available in our catalog yet. Pick another track while we expand coverage."),
            )
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError(null)

        const cleanedSeed = seedUri.trim()

        if (!cleanedSeed) {
            setError('Pick something from search before generating a mix.')
            return
        }

        if (mode === 'linked') {
            if (!user) {
                setError('Sign in to use personalized recommendations.')
                return
            }
            if (!canUseLinkedMode) {
                setError('Link Spotify or YouTube in the Account app first.')
                return
            }
        }

        const seedSummary = selectedSeed
            ? `${selectedSeed.title}${selectedSeed.subtitle ? ` · ${selectedSeed.subtitle}` : ''}`
            : cleanedSeed

        setActiveSeedLabel(seedSummary)
        setViewMode('results')

        await requestRecommendations(
            {
                mode,
                seedType,
                seedUri: cleanedSeed,
                limit,
            },
            'submit',
        )
    }

    async function handleRefresh() {
        if (!lastRequest || loading) return
        setViewMode('results')
        await requestRecommendations(lastRequest, 'refresh')
    }

    function handleChangeSongIntent() {
        if (loading) return
        setViewMode('builder')
        setRecommendations([])
        setResultMeta(null)
        setLastRequest(null)
        setError(null)
        setActiveSeedLabel('')
    }

    function handleSearchSelect(result: CatalogSearchResult) {
        skipSeedReset.current = true
        setSeedType(result.type)
        setSeedUri(result.seedUri)
        setSearchTerm(result.title)
        setSelectedSearchId(result.id)
        setSelectedSeed({
            id: result.id,
            title: result.title,
            subtitle: result.subtitle,
            provider: result.provider,
            type: result.type,
        })
    }

    function handleClearSelection() {
        setSelectedSeed(null)
        setSelectedSearchId(null)
        setSearchTerm('')
        setSeedUri('')
    }

    const showBuilder = viewMode === 'builder'
    const showResults = viewMode === 'results'
    const hasRecommendations = recommendations.length > 0
    const manualSeedLabel = seedUri
        ? seedUri.replace(/^https?:\/\//, '').replace(/www\./, '')
        : ''
    const seedLabelFallback = selectedSeed
        ? `${selectedSeed.title}${selectedSeed.subtitle ? ` · ${selectedSeed.subtitle}` : ''}`
        : manualSeedLabel
    const currentSeedLabel = activeSeedLabel || seedLabelFallback
    const seedDescriptor =
        (lastRequest?.seedType ?? seedType) === 'playlist'
            ? 'playlist'
            : 'track'
    const canSubmit = Boolean(seedUri.trim())

    return (
        <div className={styles.stage}>
            {showBuilder && (
                <section className={styles.grid}>
                    <Card>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <header className={styles.formHeader}>
                                <h2>Build a mix</h2>
                                <p className={styles.formDescription}>
                                    Search our catalog and we&apos;ll assemble a
                                    complementary queue using our similarity
                                    model. Toggle personalized mode to blend in
                                    your tastes.
                                </p>
                            </header>

                            <SeedControls
                                mode={mode}
                                personalizedLabel={personalizedLabel}
                                linkedDisabled={!canUseLinkedMode}
                                linkedHelper={linkedHelper}
                                onModeChange={setMode}
                                seedType={seedType}
                                onSeedTypeChange={setSeedType}
                                limit={limit}
                                onLimitChange={setLimit}
                            />

                            <CatalogSearchPanel
                                query={searchTerm}
                                onQueryChange={(value) => {
                                    setSearchTerm(value)
                                    setSelectedSearchId(null)
                                }}
                                busy={searching}
                                error={searchError}
                                results={searchResults}
                                selectedId={selectedSearchId}
                                onSelect={handleSearchSelect}
                                selectedSeed={selectedSeed}
                                seedUri={seedUri}
                                onClearSelection={handleClearSelection}
                            />

                            <HiddenSeedInput value={seedUri} />

                            {error && (
                                <p className={styles.formError}>{error}</p>
                            )}

                            <Button
                                type='submit'
                                disabled={loading || !canSubmit}
                            >
                                {loading
                                    ? 'Analyzing vibes…'
                                    : canSubmit
                                      ? 'Generate mix'
                                      : 'Choose a song'}
                            </Button>
                        </form>
                    </Card>

                    <div className={styles.side}>
                        <AuthCard
                            userEmail={user?.email}
                            connections={connections}
                            loading={authLoading}
                        />
                    </div>
                </section>
            )}

            {showResults && (
                <section className={styles.results}>
                    <Card>
                        <div className={styles.resultsActions}>
                            <div>
                                <h2 className={styles.resultsHeading}>
                                    Recommendations ready
                                </h2>
                                <p className={styles.resultsDescription}>
                                    {hasRecommendations || loading
                                        ? `Built from your ${seedDescriptor} seed${currentSeedLabel ? `: ${currentSeedLabel}` : ''}.`
                                        : 'We&apos;re warming up your mix. Hang tight or adjust the seed.'}
                                </p>
                            </div>
                            <div className={styles.resultsButtons}>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={handleRefresh}
                                    disabled={!lastRequest || loading}
                                >
                                    {refreshing
                                        ? 'Refreshing…'
                                        : 'Refresh results'}
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleChangeSongIntent}
                                    disabled={loading}
                                >
                                    Change song
                                </Button>
                            </div>
                        </div>
                        {error && (
                            <p className={styles.resultsError}>{error}</p>
                        )}
                    </Card>

                    {loading && !refreshing && <RecommendationsSkeleton />}

                    {!loading && hasRecommendations && (
                        <RecommendationsList
                            recommendations={recommendations}
                            metadata={resultMeta}
                        />
                    )}

                    {!loading && !error && !hasRecommendations && (
                        <Card>
                            <p className={styles.emptyStateText}>
                                We couldn&apos;t assemble a mix for that seed
                                yet.
                            </p>
                            <small className={styles.emptyStateHint}>
                                Try refreshing for a new batch or change the
                                song to explore another vibe.
                            </small>
                        </Card>
                    )}
                </section>
            )}
        </div>
    )
}

function parseError(err: unknown) {
    if (!(err instanceof Error)) return null
    const message = err.message
    const match = message.match(/:\s(.+)$/)
    const detail = match ? match[1] : message
    if (!detail || detail.startsWith('API POST')) return null
    return detail
}
