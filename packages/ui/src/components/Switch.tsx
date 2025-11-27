'use client'

import * as React from 'react'
import { useTheme } from '../ThemeProvider'

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export type SwitchProps = Omit<NativeButtonProps, 'onChange'> & {
    checked: boolean
    onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            checked,
            onCheckedChange,
            disabled,
            style,
            onClick,
            onKeyDown,
            onFocus,
            onBlur,
            ...rest
        },
        ref,
    ) => {
        const theme = useTheme()
        const [focused, setFocused] = React.useState(false)
        const toggle = React.useCallback(() => {
            if (disabled) return
            onCheckedChange?.(!checked)
        }, [checked, disabled, onCheckedChange])

        return (
            <button
                {...rest}
                ref={ref}
                type='button'
                role='switch'
                aria-checked={checked}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={(event) => {
                    onClick?.(event)
                    if (event.defaultPrevented) return
                    event.preventDefault()
                    toggle()
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggle()
                        return
                    }
                    onKeyDown?.(event)
                }}
                onFocus={(event) => {
                    setFocused(true)
                    onFocus?.(event)
                }}
                onBlur={(event) => {
                    setFocused(false)
                    onBlur?.(event)
                }}
                style={{
                    width: 54,
                    height: 30,
                    borderRadius: 999,
                    border: checked
                        ? `1px solid ${theme.colors.accent[300]}`
                        : `1px solid ${theme.colors.border}`,
                    background: checked
                        ? `linear-gradient(120deg, ${theme.colors.accent[400]}, ${theme.colors.accentSecondary[400]})`
                        : theme.colors.surfaceMuted,
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0 4px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    boxShadow: `${checked ? theme.shadows.medium : theme.shadows.subtle}${focused ? `, ${theme.states.focusRing}` : ''}`,
                    transition:
                        'background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
                    position: 'relative',
                    outline: 'none',
                    ...style,
                }}
            >
                <span
                    aria-hidden
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: theme.colors.textOnAccent,
                        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.35)',
                        transform: checked
                            ? 'translateX(22px)'
                            : 'translateX(0)',
                        transition:
                            'transform 160ms ease, box-shadow 160ms ease',
                    }}
                />
            </button>
        )
    },
)

Switch.displayName = 'Switch'
