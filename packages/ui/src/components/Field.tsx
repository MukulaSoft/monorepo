'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'
import type { InputStatus } from './Input'

export type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
    label?: React.ReactNode
    hint?: React.ReactNode
    message?: React.ReactNode
    htmlFor?: string
    required?: boolean
    optionalLabel?: string
    layout?: 'vertical' | 'horizontal'
    status?: InputStatus
    children: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({
    label,
    hint,
    message,
    htmlFor,
    required = false,
    optionalLabel = 'Optional',
    layout = 'vertical',
    status = 'default',
    children,
    style,
    ...rest
}) => {
    const theme = useTheme()

    const statusColor =
        status === 'success'
            ? theme.colors.success[400]
            : status === 'error'
              ? theme.colors.danger[400]
              : theme.colors.textMuted

    return (
        <div
            {...rest}
            style={{
                display: 'flex',
                flexDirection: layout === 'horizontal' ? 'row' : 'column',
                gap:
                    layout === 'horizontal'
                        ? theme.spacing.lg
                        : theme.spacing.sm,
                width: '100%',
                ...style,
            }}
        >
            {label && (
                <div
                    style={{
                        minWidth: layout === 'horizontal' ? 180 : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs,
                        color: theme.colors.text,
                        fontWeight: 600,
                    }}
                >
                    <label htmlFor={htmlFor} style={{ width: '100%' }}>
                        {label}
                    </label>
                    {!required && (
                        <span
                            style={{
                                fontSize: theme.typography.textSizes.xs,
                                color: theme.colors.textMuted,
                            }}
                        >
                            {optionalLabel}
                        </span>
                    )}
                    {required && (
                        <span
                            style={{
                                fontSize: theme.typography.textSizes.xs,
                                color: theme.colors.accent[200],
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Required
                        </span>
                    )}
                </div>
            )}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.xs,
                }}
            >
                {children}
                {(hint || message) && (
                    <p
                        style={{
                            margin: 0,
                            color: message
                                ? statusColor
                                : theme.colors.textMuted,
                            fontSize: theme.typography.textSizes.sm,
                        }}
                    >
                        {message ?? hint}
                    </p>
                )}
            </div>
        </div>
    )
}
