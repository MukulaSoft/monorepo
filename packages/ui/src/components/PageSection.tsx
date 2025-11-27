'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'

export type PageSectionProps = {
    title?: React.ReactNode
    subtitle?: React.ReactNode
    actions?: React.ReactNode
    bleed?: boolean
    spacing?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

const spacingMap = {
    sm: '1.5rem',
    md: '2.5rem',
    lg: '3.5rem',
}

export const PageSection: React.FC<PageSectionProps> = (
    props: PageSectionProps,
) => {
    const {
        title,
        subtitle,
        actions,
        bleed = false,
        spacing = 'md',
        children,
    } = props
    const theme = useTheme()
    const resolvedSpacing: keyof typeof spacingMap = spacing

    return (
        <section
            style={{
                padding: bleed
                    ? '0'
                    : `${spacingMap[resolvedSpacing]} ${theme.spacing.lg}`,
                borderRadius: bleed ? undefined : theme.radii.card,
                background: bleed ? 'transparent' : theme.colors.surface,
                border: bleed ? 'none' : `1px solid ${theme.colors.border}`,
                boxShadow: bleed ? 'none' : theme.shadows.subtle,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
            }}
        >
            {(title || subtitle || actions) && (
                <header
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: subtitle ? 'flex-start' : 'center',
                        justifyContent: 'space-between',
                        gap: theme.spacing.sm,
                    }}
                >
                    <div>
                        {title && (
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: theme.typography.headingSizes.h3,
                                    color: theme.colors.text,
                                }}
                            >
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p
                                style={{
                                    marginTop: theme.spacing.xs,
                                    marginBottom: 0,
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.textSizes.md,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && <div>{actions}</div>}
                </header>
            )}
            <div>{children}</div>
        </section>
    )
}
