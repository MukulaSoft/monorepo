'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'

type BackgroundStyle = 'gradient' | 'mesh' | 'plain'

export type LayoutShellProps = {
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    sidebar?: React.ReactNode
    backgroundStyle?: BackgroundStyle
    maxWidth?: string
    padded?: boolean
}

export const LayoutShell: React.FC<LayoutShellProps> = ({
    children,
    header,
    footer,
    sidebar,
    backgroundStyle = 'gradient',
    maxWidth,
    padded = true,
}) => {
    const theme = useTheme()

    const backgroundLayers: Record<BackgroundStyle, string> = {
        gradient: theme.colors.gradients.hero,
        mesh: 'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.12), transparent 45%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.12), transparent 35%), linear-gradient(140deg, rgba(255,255,255,0.03), rgba(15,23,42,0.95))',
        plain: theme.colors.background,
    }

    const containerPadding = padded
        ? `${theme.spacing.xl} ${theme.spacing.lg}`
        : `${theme.spacing.lg} ${theme.spacing.lg}`

    return (
        <div
            style={{
                minHeight: '100vh',
                background: backgroundLayers[backgroundStyle],
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {header && (
                <header
                    style={{
                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                        borderBottom: `1px solid ${theme.colors.border}`,
                        backdropFilter: 'blur(24px)',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                    }}
                >
                    {header}
                </header>
            )}
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    width: '100%',
                }}
            >
                {sidebar && (
                    <aside
                        style={{
                            minWidth: 260,
                            padding: containerPadding,
                            borderRight: `1px solid ${theme.colors.border}`,
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        {sidebar}
                    </aside>
                )}
                <main
                    style={{
                        flex: 1,
                        width: '100%',
                        maxWidth: maxWidth ?? theme.layout.contentWidth,
                        margin: '0 auto',
                        padding: containerPadding,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.xl,
                    }}
                >
                    {children}
                </main>
            </div>
            {footer && (
                <footer
                    style={{
                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                        borderTop: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.backgroundAlt,
                    }}
                >
                    {footer}
                </footer>
            )}
        </div>
    )
}
