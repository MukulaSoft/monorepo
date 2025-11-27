'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { InputStatus, InputVariant } from './Input'
import type { MukulaTheme } from '../types'

export type TextAreaProps =
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        variant?: InputVariant
        status?: InputStatus
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

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            variant = 'outline',
            status = 'default',
            wrapperStyle,
            style,
            rows = 4,
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

        return (
            <div
                style={{
                    borderRadius: theme.radii.md,
                    border: `1px solid ${resolvedVariant.border}`,
                    background: resolvedVariant.background,
                    padding: theme.spacing.md,
                    boxShadow: focused
                        ? theme.states.focusShadow
                        : theme.shadows.subtle,
                    transition:
                        'border-color 160ms ease, box-shadow 160ms ease',
                    opacity: disabled ? theme.states.disabledOpacity : 1,
                    ...(focused
                        ? {
                              borderColor: palette,
                          }
                        : {}),
                    ...wrapperStyle,
                }}
            >
                <textarea
                    ref={ref}
                    {...rest}
                    rows={rows}
                    disabled={disabled}
                    style={{
                        width: '100%',
                        minHeight: '4rem',
                        border: 'none',
                        background: 'transparent',
                        color: disabled
                            ? theme.colors.textMuted
                            : theme.colors.text,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.textSizes.md,
                        lineHeight: theme.typography.lineHeight,
                        resize: 'vertical',
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
            </div>
        )
    },
)

TextArea.displayName = 'TextArea'
