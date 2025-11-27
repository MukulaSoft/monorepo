'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { MukulaTheme } from '../types'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'outline' | 'filled' | 'subtle'
export type InputStatus = 'default' | 'success' | 'error'

type NativeInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size'
>

export type InputProps = NativeInputProps & {
    size?: InputSize
    variant?: InputVariant
    status?: InputStatus
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    wrapperStyle?: React.CSSProperties
}

const statusColor = (theme: MukulaTheme, status: InputStatus) => {
    switch (status) {
        case 'success':
            return theme.colors.success[400]
        case 'error':
            return theme.colors.danger[400]
        default:
            return theme.colors.accent[400]
    }
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            size: controlSize = 'md',
            variant = 'outline',
            status = 'default',
            prefix,
            suffix,
            wrapperStyle,
            style,
            disabled,
            onFocus,
            onBlur,
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme()
        const [focused, setFocused] = React.useState(false)
        const palette = statusColor(theme, status)

        const sizeTokens: Record<
            InputSize,
            { height: string; fontSize: string; paddingX: string }
        > = {
            sm: {
                height: '2.25rem',
                fontSize: theme.typography.textSizes.sm,
                paddingX: theme.spacing.sm,
            },
            md: {
                height: '2.75rem',
                fontSize: theme.typography.textSizes.md,
                paddingX: theme.spacing.md,
            },
            lg: {
                height: '3.2rem',
                fontSize: theme.typography.textSizes.lg,
                paddingX: theme.spacing.lg,
            },
        }

        const variantTokens: Record<
            InputVariant,
            { background: string; border: string }
        > = {
            outline: {
                background: theme.colors.backgroundAlt,
                border: theme.colors.border,
            },
            filled: {
                background: theme.colors.surface,
                border: 'transparent',
            },
            subtle: {
                background: theme.colors.surfaceMuted,
                border: 'transparent',
            },
        }

        const resolvedVariant = variantTokens[variant]

        const currentSize: InputSize = controlSize ?? 'md'

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    borderRadius: theme.radii.md,
                    minHeight: sizeTokens[currentSize].height,
                    paddingLeft: prefix
                        ? theme.spacing.sm
                        : sizeTokens[currentSize].paddingX,
                    paddingRight: suffix
                        ? theme.spacing.sm
                        : sizeTokens[currentSize].paddingX,
                    border: `1px solid ${resolvedVariant.border}`,
                    background: resolvedVariant.background,
                    boxShadow: focused
                        ? theme.states.focusShadow
                        : theme.shadows.subtle,
                    transition:
                        'border-color 160ms ease, box-shadow 160ms ease, background 160ms ease',
                    opacity: disabled ? theme.states.disabledOpacity : 1,
                    cursor: disabled ? 'not-allowed' : 'text',
                    ...(focused
                        ? {
                              borderColor: palette,
                          }
                        : {}),
                    ...wrapperStyle,
                }}
            >
                {prefix && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: theme.colors.textMuted,
                        }}
                    >
                        {prefix}
                    </span>
                )}
                <input
                    ref={ref}
                    {...rest}
                    disabled={disabled}
                    style={{
                        flex: 1,
                        width: '100%',
                        minHeight: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: disabled
                            ? theme.colors.textMuted
                            : theme.colors.text,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: sizeTokens[currentSize].fontSize,
                        lineHeight: theme.typography.lineHeight,
                        outline: 'none',
                        padding: 0,
                        ...style,
                    }}
                    onFocus={(event) => {
                        setFocused(true)
                        onFocus?.(event)
                    }}
                    onBlur={(event) => {
                        setFocused(false)
                        onBlur?.(event)
                    }}
                    aria-invalid={status === 'error' || undefined}
                />
                {suffix && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: theme.colors.textMuted,
                        }}
                    >
                        {suffix}
                    </span>
                )}
            </div>
        )
    },
)

Input.displayName = 'Input'
