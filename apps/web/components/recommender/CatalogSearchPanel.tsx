'use client'

import { memo } from 'react'
import { Field, Input, Button, mukulaTheme } from '@mukulasoft/ui'
import {
    catalogProviderLabels,
    type CatalogProviderId,
    type CatalogSearchResult,
    type RecommendationSeedType,
} from '@mukulasoft/utils'
import { ProviderGlyph } from './ProviderGlyph'

type SelectedSeedSummary = {
    id: string
    title: string
    subtitle?: string
    provider: CatalogProviderId
    type: RecommendationSeedType
}

export type CatalogSearchPanelProps = {
    query: string
    onQueryChange: (value: string) => void
    busy: boolean
    error: string | null
    results: CatalogSearchResult[]
    selectedId: string | null
    onSelect: (result: CatalogSearchResult) => void
    selectedSeed: SelectedSeedSummary | null
    seedUri: string
    onClearSelection: () => void
}

export function CatalogSearchPanel({
    query,
    onQueryChange,
    busy,
    error,
    results,
    selectedId,
    onSelect,
    selectedSeed,
    seedUri,
    onClearSelection,
}: CatalogSearchPanelProps) {
    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
            <Field
                label='Search or paste a link'
                hint='Pick a match to auto-fill the seed link'
            >
                <Input
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder='Search songs or playlists'
                />
                <SearchResultsList
                    query={query}
                    results={results}
                    busy={busy}
                    error={error}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            </Field>

            <SelectionSummary
                seed={selectedSeed}
                fallbackUri={seedUri}
                onClear={onClearSelection}
            />
        </div>
    )
}

type SelectionSummaryProps = {
    seed: SelectedSeedSummary | null
    fallbackUri: string
    onClear: () => void
}

function SelectionSummary({
    seed,
    fallbackUri,
    onClear,
}: SelectionSummaryProps) {
    const trimmedUri = fallbackUri.trim()
    const providerBadges = ['Spotify', 'YouTube']

    if (!seed && !trimmedUri) {
        return (
            <div
                style={{
                    borderRadius: 12,
                    padding: '0.85rem 1rem',
                    background: 'rgba(8,8,16,0.35)',
                    border: '1px dashed rgba(255,255,255,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                }}
            >
                <strong style={{ display: 'block' }}>
                    Pick a song to get started
                </strong>
                <small style={{ color: mukulaTheme.colors.textMuted }}>
                    Search above to unlock recommendations.
                </small>
                <div
                    style={{
                        display: 'flex',
                        gap: '0.35rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {providerBadges.map((label) => (
                        <span
                            key={label}
                            style={{
                                borderRadius: 999,
                                padding: '0.2rem 0.6rem',
                                background: 'rgba(255,255,255,0.06)',
                                fontSize: '0.75rem',
                                color: mukulaTheme.colors.textMuted,
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    if (!seed && trimmedUri) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(8,8,16,0.35)',
                }}
            >
                <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>
                        Using pasted link
                    </strong>
                    <small style={{ color: mukulaTheme.colors.textMuted }}>
                        {truncateUri(trimmedUri)}
                    </small>
                </div>
                <Button type='button' variant='ghost' onClick={onClear}>
                    Clear
                </Button>
            </div>
        )
    }

    if (!seed) {
        return null
    }

    const secondaryLine = seed.subtitle ?? `${seed.type} seed`

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                border: '1px solid rgba(143,240,174,0.35)',
                background: 'rgba(143,240,174,0.08)',
            }}
        >
            <ProviderGlyph provider={seed.provider} />
            <div style={{ flex: 1 }}>
                <strong style={{ display: 'block' }}>{seed.title}</strong>
                <small style={{ color: mukulaTheme.colors.textMuted }}>
                    {catalogProviderLabels[seed.provider]} · {secondaryLine}
                </small>
            </div>
            <Button type='button' variant='ghost' onClick={onClear}>
                Clear
            </Button>
        </div>
    )
}

type SearchResultsListProps = {
    query: string
    results: CatalogSearchResult[]
    busy: boolean
    error: string | null
    selectedId: string | null
    onSelect: (result: CatalogSearchResult) => void
}

const SearchResultsList = memo(function SearchResultsList({
    query,
    results,
    busy,
    error,
    selectedId,
    onSelect,
}: SearchResultsListProps) {
    if (!query.trim() || query.trim().length < 2) return null

    return (
        <div
            style={{
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
            }}
        >
            {busy && (
                <small style={{ color: mukulaTheme.colors.textMuted }}>
                    Searching…
                </small>
            )}
            {error && <small style={{ color: '#ff9e9e' }}>{error}</small>}
            {!busy && !error && results.length === 0 && (
                <small style={{ color: mukulaTheme.colors.textMuted }}>
                    No matches for "{query}". Try another artist, title, or
                    paste a full link.
                </small>
            )}
            {!busy &&
                !error &&
                results.map((result) => (
                    <button
                        key={result.id}
                        type='button'
                        onClick={() => onSelect(result)}
                        style={{
                            borderRadius: 10,
                            border: `1px solid ${selectedId === result.id ? '#8ff0ae' : 'rgba(255,255,255,0.12)'}`,
                            background:
                                selectedId === result.id
                                    ? 'rgba(143, 240, 174, 0.08)'
                                    : 'rgba(8,8,16,0.35)',
                            padding: '0.5rem 0.75rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: 'inherit',
                        }}
                    >
                        <ProviderGlyph provider={result.provider} />
                        <div style={{ textAlign: 'left' }}>
                            <strong style={{ display: 'block' }}>
                                {result.title}
                            </strong>
                            <small
                                style={{ color: mukulaTheme.colors.textMuted }}
                            >
                                {result.subtitle}
                            </small>
                        </div>
                        <span
                            style={{
                                marginLeft: 'auto',
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                                color: '#9fb8ff',
                            }}
                        >
                            {result.type}
                        </span>
                    </button>
                ))}
        </div>
    )
})

export function HiddenSeedInput({ value }: { value: string }) {
    return <input type='hidden' name='seedUri' value={value} readOnly />
}

function truncateUri(value: string, maxLength = 56) {
    if (value.length <= maxLength) return value
    return `${value.slice(0, maxLength - 1)}…`
}

export type { SelectedSeedSummary }
