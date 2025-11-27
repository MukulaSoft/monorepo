const DEFAULT_SLUG_FALLBACK = 'mukulasoft'

export function slugify(
    value: string,
    { maxLength = 64, fallback = DEFAULT_SLUG_FALLBACK }: SlugifyOptions = {},
): string {
    const normalized = value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-')
        .slice(0, maxLength)

    if (normalized) return normalized
    return fallback.slice(0, maxLength)
}

export type SlugifyOptions = {
    maxLength?: number
    fallback?: string
}

export function truncate(value: string, maxLength = 56): string {
    if (value.length <= maxLength) return value
    return `${value.slice(0, Math.max(1, maxLength - 1))}…`
}

export function titleCase(value: string): string {
    return value.replace(/\w\S*/g, (fragment) => {
        return (
            fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase()
        )
    })
}
