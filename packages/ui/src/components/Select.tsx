'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { InputSize, InputVariant, InputStatus } from './Input'
import type { MukulaTheme } from '../types'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    size?: InputSize
    variant?: InputVariant
    status?: InputStatus
    prefix?: React.ReactNode
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (props: SelectProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
        const {
            size = 'md',
            variant = 'outline',
            status = 'default',
            prefix,
            wrapperStyle,
            style,
            disabled,
            children,
            onFocus,
            onBlur,
            ...rest
        } = props
        const theme = useTheme()
        const [focused, setFocused] = React.useState(false)
        const palette = statusColor(theme, status)
        const resolvedSize: InputSize = size
        const resolvedVariant: InputVariant = variant

        const sizeTokens: Record<
            InputSize,
            { height: string; fontSize: string; paddingX: string }
        > = {
            sm: {
                height: '2.4rem',
                fontSize: theme.typography.textSizes.sm,
                paddingX: theme.spacing.sm,
            },
            md: {
                height: '2.9rem',
                fontSize: theme.typography.textSizes.md,
                paddingX: theme.spacing.md,
            },
            lg: {
                height: '3.35rem',
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

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: theme.radii.md,
                    border: `1px solid ${variantTokens[resolvedVariant].border}`,
                    background: variantTokens[resolvedVariant].background,
                    minHeight: sizeTokens[resolvedSize].height,
                    paddingLeft: prefix
                        ? theme.spacing.sm
                        : sizeTokens[resolvedSize].paddingX,
                    paddingRight: sizeTokens[resolvedSize].paddingX,
                    gap: theme.spacing.xs,
                    boxShadow: focused
                        ? theme.states.focusShadow
                        : theme.shadows.subtle,
                    transition:
                        'border-color 160ms ease, box-shadow 160ms ease',
                    opacity: disabled ? theme.states.disabledOpacity : 1,
                    ...(focused ? { borderColor: palette } : {}),
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
                <select
                    {...rest}
                    ref={ref}
                    disabled={disabled}
                    style={{
                        flex: 1,
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: theme.colors.text,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: sizeTokens[resolvedSize].fontSize,
                        outline: 'none',
                        appearance: 'none',
                        padding: 0,
                        ...style,
                    }}
                    onFocus={(event: React.FocusEvent<HTMLSelectElement>) => {
                        setFocused(true)
                        onFocus?.(event)
                    }}
                    onBlur={(event: React.FocusEvent<HTMLSelectElement>) => {
                        setFocused(false)
                        onBlur?.(event)
                    }}
                    aria-invalid={status === 'error' || undefined}
                >
                    {children}
                </select>
                <span
                    aria-hidden
                    style={{
                        display: 'inline-flex',
                        color: focused ? palette : theme.colors.textMuted,
                    }}
                >
                    <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M4 6L8 10L12 6'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                </span>
            </div>
        )
    },
)

Select.displayName = 'Select'
