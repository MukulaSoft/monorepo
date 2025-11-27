'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: React.ReactNode
    description?: React.ReactNode
    indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    (
        props: CheckboxProps,
        forwardedRef: React.ForwardedRef<HTMLInputElement>,
    ) => {
        const {
            label,
            description,
            indeterminate = false,
            disabled,
            style,
            ...rest
        } = props
        const theme = useTheme()
        const internalRef = React.useRef<HTMLInputElement | null>(null)

        const setRefs = React.useCallback(
            (node: HTMLInputElement | null) => {
                internalRef.current = node
                if (typeof forwardedRef === 'function') {
                    forwardedRef(node)
                } else if (forwardedRef) {
                    forwardedRef.current = node
                }
            },
            [forwardedRef],
        )

        React.useEffect(() => {
            if (internalRef.current) {
                internalRef.current.indeterminate = indeterminate
            }
        }, [indeterminate])

        const checked = Boolean(rest.checked)

        return (
            <label
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? theme.states.disabledOpacity : 1,
                    color: theme.colors.text,
                    ...style,
                }}
            >
                <span
                    aria-hidden
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: theme.radii.sm,
                        border: `1px solid ${checked || indeterminate ? theme.colors.accent[300] : theme.colors.border}`,
                        background:
                            checked || indeterminate
                                ? `linear-gradient(120deg, ${theme.colors.accent[400]}, ${theme.colors.accentSecondary[400]})`
                                : theme.colors.surfaceMuted,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow:
                            checked || indeterminate
                                ? theme.shadows.medium
                                : theme.shadows.subtle,
                        transition:
                            'border-color 140ms ease, background 140ms ease, box-shadow 140ms ease',
                    }}
                >
                    {(checked || indeterminate) && (
                        <svg
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            {indeterminate ? (
                                <rect
                                    x='2'
                                    y='5.25'
                                    width='8'
                                    height='1.5'
                                    rx='0.75'
                                    fill={theme.colors.textOnAccent}
                                />
                            ) : (
                                <path
                                    d='M2.5 6.5L4.5 8.5L9.5 3.5'
                                    stroke={theme.colors.textOnAccent}
                                    strokeWidth='1.8'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            )}
                        </svg>
                    )}
                </span>
                <div style={{ flex: 1 }}>
                    {label && (
                        <span
                            style={{
                                fontWeight: 600,
                                display: 'block',
                                marginBottom: description ? '0.1rem' : 0,
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            style={{
                                display: 'block',
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.textSizes.sm,
                            }}
                        >
                            {description}
                        </span>
                    )}
                </div>
                <input
                    {...rest}
                    ref={setRefs}
                    type='checkbox'
                    disabled={disabled}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        pointerEvents: 'none',
                    }}
                />
            </label>
        )
    },
)

Checkbox.displayName = 'Checkbox'
