'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { MukulaTheme } from '../types'

type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link'
type ButtonTone = 'brand' | 'neutral' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    tone?: ButtonTone
    size?: ButtonSize
    fullWidth?: boolean
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
    loading?: boolean
}

const sizeTokens: Record<ButtonSize, { padding: string; fontSize: string }> = {
    sm: { padding: '0.35rem 0.9rem', fontSize: '0.875rem' },
    md: { padding: '0.55rem 1.25rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.0625rem' },
}

const toneTokens = (theme: MukulaTheme, tone: ButtonTone) => {
    switch (tone) {
        case 'danger':
            return {
                solidBg: `linear-gradient(120deg, ${theme.colors.danger[500]}, ${theme.colors.danger[600]})`,
                softBg: 'rgba(239, 68, 68, 0.12)',
                border: `rgba(239, 68, 68, 0.55)`,
                text: theme.colors.textOnAccent,
                softText: theme.colors.danger[200],
            }
        case 'success':
            return {
                solidBg: `linear-gradient(120deg, ${theme.colors.success[500]}, ${theme.colors.success[600]})`,
                softBg: 'rgba(34, 197, 94, 0.12)',
                border: `rgba(34, 197, 94, 0.45)`,
                text: theme.colors.textOnAccent,
                softText: theme.colors.success[100],
            }
        case 'neutral':
            return {
                solidBg: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.surfaceMuted})`,
                softBg: 'rgba(148, 163, 184, 0.16)',
                border: theme.colors.border,
                text: theme.colors.text,
                softText: theme.colors.text,
            }
        case 'brand':
        default:
            return {
                solidBg: theme.colors.gradients.brand,
                softBg: 'rgba(139, 92, 246, 0.18)',
                border: `rgba(139, 92, 246, 0.45)`,
                text: theme.colors.textOnAccent,
                softText: theme.colors.accent[100],
            }
    }
}

const resolveVariantStyles = (
    variant: ButtonVariant,
    tone: ButtonTone,
    theme: MukulaTheme,
): React.CSSProperties => {
    const tokens = toneTokens(theme, tone)

    switch (variant) {
        case 'soft':
            return {
                background: tokens.softBg,
                color: tokens.softText,
                border: `1px solid ${tokens.border}`,
                boxShadow: theme.shadows.subtle,
            }
        case 'outline':
            return {
                background: theme.colors.surfaceMuted,
                color: tone === 'neutral' ? theme.colors.text : tokens.softText,
                border: `1px solid ${tokens.border}`,
                boxShadow: theme.shadows.outline,
            }
        case 'ghost':
            return {
                background: 'transparent',
                color: tone === 'neutral' ? theme.colors.text : tokens.softText,
                border: '1px solid transparent',
                boxShadow: 'none',
            }
        case 'link':
            return {
                background: 'transparent',
                color:
                    tone === 'neutral'
                        ? theme.colors.accentSecondary[200]
                        : theme.colors.accent[200],
                border: 'none',
                boxShadow: 'none',
                padding: 0,
            }
        case 'solid':
        default:
            return {
                background: tokens.solidBg,
                color: tokens.text,
                border: `1px solid ${tokens.border}`,
                boxShadow: theme.shadows.medium,
            }
    }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'solid',
            tone = 'brand',
            size = 'md',
            fullWidth,
            leadingIcon,
            trailingIcon,
            loading = false,
            disabled,
            children,
            style,
            type = 'button',
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme()
        const sizeStyle = sizeTokens[size]
        const variantStyle = resolveVariantStyles(variant, tone, theme)
        const isDisabled = disabled || loading

        return (
            <button
                ref={ref}
                {...rest}
                type={type}
                disabled={isDisabled}
                aria-busy={loading || undefined}
                style={{
                    borderRadius: theme.radii.pill,
                    border: 'none',
                    fontWeight: 600,
                    letterSpacing: 0.1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    transition:
                        'transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
                    transform: isDisabled ? 'none' : 'translateY(0)',
                    opacity: isDisabled ? theme.states.disabledOpacity : 1,
                    width: fullWidth ? '100%' : 'auto',
                    ...sizeStyle,
                    ...variantStyle,
                    ...style,
                }}
            >
                {leadingIcon && (
                    <span aria-hidden style={{ display: 'inline-flex' }}>
                        {leadingIcon}
                    </span>
                )}
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {children}
                </span>
                {(trailingIcon || loading) && (
                    <span aria-hidden style={{ display: 'inline-flex' }}>
                        {loading ? '…' : trailingIcon}
                    </span>
                )}
            </button>
        )
    },
)

Button.displayName = 'Button'
