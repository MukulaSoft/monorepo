'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { SpacingScale } from '../types'

type CardVariant = 'elevated' | 'outline' | 'translucent'
type CardPadding = 'sm' | 'md' | 'lg'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    variant?: CardVariant
    padding?: CardPadding
    interactive?: boolean
    header?: React.ReactNode
    footer?: React.ReactNode
    divider?: boolean
}

const paddingMap: Record<CardPadding, keyof SpacingScale> = {
    sm: 'md',
    md: 'lg',
    lg: 'xl',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'elevated',
            padding = 'lg',
            interactive = false,
            header,
            footer,
            divider = Boolean(footer),
            style,
            children,
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme()

        const backgroundByVariant: Record<CardVariant, React.CSSProperties> = {
            elevated: {
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadows.medium,
            },
            outline: {
                background: theme.colors.backgroundAlt,
                border: `1px solid ${theme.colors.borderStrong}`,
                boxShadow: theme.shadows.outline,
            },
            translucent: {
                background: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(18px)',
            },
        }

        return (
            <div
                ref={ref}
                {...rest}
                style={{
                    borderRadius: theme.radii.card,
                    padding: theme.spacing[paddingMap[padding]],
                    color: theme.colors.text,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.md,
                    transition:
                        'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                    transform: interactive ? 'translateY(0)' : undefined,
                    cursor: interactive ? 'pointer' : undefined,
                    ...backgroundByVariant[variant],
                    ...(interactive
                        ? {
                              boxShadow: theme.shadows.strong,
                          }
                        : {}),
                    ...style,
                }}
            >
                {header && <div>{header}</div>}
                <div>{children}</div>
                {footer && (
                    <div
                        style={{
                            borderTop: divider
                                ? `1px solid ${theme.colors.border}`
                                : 'none',
                            paddingTop: divider ? theme.spacing.sm : 0,
                        }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        )
    },
)

Card.displayName = 'Card'
