'use client'

import * as React from 'react'

import { mukulaTheme } from './theme'
import type { MukulaTheme, RecursivePartial } from './types'

const ThemeContext = React.createContext<MukulaTheme>(mukulaTheme)

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const deepMerge = (base: unknown, overrides?: unknown): unknown => {
    if (overrides === undefined) {
        return base
    }

    if (!isRecord(base)) {
        return overrides
    }

    if (!isRecord(overrides)) {
        return overrides
    }

    const result: Record<string, unknown> = { ...base }

    Object.entries(overrides).forEach(([key, value]) => {
        const current = result[key]

        if (isRecord(current) && isRecord(value)) {
            result[key] = deepMerge(current, value)
            return
        }

        result[key] = value
    })

    return result
}

const toKebabCase = (value: string) =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()

const flattenTheme = (
    value: unknown,
    path: string[] = [],
    acc: Record<string, string> = {},
): Record<string, string> => {
    if (typeof value === 'string' || typeof value === 'number') {
        const key = path.map(toKebabCase).join('-')
        acc[key] = String(value)
        return acc
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            flattenTheme(item, [...path, String(index)], acc)
        })
        return acc
    }

    if (isRecord(value)) {
        Object.entries(value).forEach(([childKey, childValue]) => {
            flattenTheme(childValue, [...path, childKey], acc)
        })
    }

    return acc
}

const createCSSVariableBlock = (
    theme: MukulaTheme,
    scope: string,
    prefix: string,
): string => {
    const flat = flattenTheme(theme)

    const declarations = Object.entries(flat)
        .map(([token, tokenValue]) => `${prefix}-${token}: ${tokenValue};`)
        .join('\n')

    return `${scope} {\n${declarations}\n}`
}

type ThemeProviderProps = {
    children: React.ReactNode
    theme?:
        | RecursivePartial<MukulaTheme>
        | ((theme: MukulaTheme) => MukulaTheme)
    injectCssVariables?: boolean
    cssVariablesScope?: string
    cssVariablePrefix?: string
}

export const ThemeProvider = ({
    children,
    theme,
    injectCssVariables = true,
    cssVariablesScope = ':root',
    cssVariablePrefix = '--mukula',
}: ThemeProviderProps) => {
    const resolvedTheme = React.useMemo(() => {
        if (!theme) {
            return mukulaTheme
        }

        if (typeof theme === 'function') {
            return theme(mukulaTheme)
        }

        return deepMerge(mukulaTheme, theme) as MukulaTheme
    }, [theme])

    const cssBlock = React.useMemo(() => {
        if (!injectCssVariables) {
            return null
        }

        return createCSSVariableBlock(
            resolvedTheme,
            cssVariablesScope,
            cssVariablePrefix,
        )
    }, [
        injectCssVariables,
        resolvedTheme,
        cssVariablePrefix,
        cssVariablesScope,
    ])

    return (
        <ThemeContext.Provider value={resolvedTheme}>
            {injectCssVariables && cssBlock ? (
                <style data-mukula-theme='true'>{cssBlock}</style>
            ) : null}
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => React.useContext(ThemeContext)
export const ThemeConsumer = ThemeContext.Consumer
