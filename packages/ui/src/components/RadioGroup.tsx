'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'

export type RadioOption = {
    label: React.ReactNode
    value: string
    description?: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
}

type Layout = 'vertical' | 'horizontal'

export type RadioGroupProps = {
    name: string
    options: RadioOption[]
    layout?: Layout
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
}

export const RadioGroup: React.FC<RadioGroupProps> = (
    props: RadioGroupProps,
) => {
    const {
        name,
        options,
        layout = 'vertical',
        value,
        defaultValue,
        onChange,
    } = props
    const theme = useTheme()
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
        defaultValue ?? options[0]?.value ?? '',
    )

    const isControlled = value !== undefined
    const selectedValue = isControlled ? value : uncontrolledValue

    const handleSelect = (optionValue: string) => {
        if (!isControlled) {
            setUncontrolledValue(optionValue)
        }
        onChange?.(optionValue)
    }

    return (
        <div
            role='radiogroup'
            style={{
                display: 'grid',
                gap: theme.spacing.sm,
                gridTemplateColumns:
                    layout === 'horizontal'
                        ? 'repeat(auto-fit, minmax(220px, 1fr))'
                        : '1fr',
            }}
        >
            {options.map((option: RadioOption) => {
                const active = selectedValue === option.value
                const disabled = option.disabled

                return (
                    <label
                        key={option.value}
                        style={{
                            borderRadius: theme.radii.card,
                            border: active
                                ? `1px solid ${theme.colors.accent[300]}`
                                : `1px solid ${theme.colors.border}`,
                            background: active
                                ? 'linear-gradient(120deg, rgba(139,92,246,0.15), rgba(34,211,238,0.15))'
                                : theme.colors.surfaceMuted,
                            boxShadow: active
                                ? theme.shadows.medium
                                : theme.shadows.subtle,
                            padding: theme.spacing.md,
                            display: 'flex',
                            gap: theme.spacing.sm,
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled
                                ? theme.states.disabledOpacity
                                : 1,
                            transition:
                                'border-color 160ms ease, background 160ms ease, transform 160ms ease',
                            transform: active ? 'translateY(-1px)' : 'none',
                        }}
                    >
                        <span
                            aria-hidden
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                border: active
                                    ? `6px solid ${theme.colors.accent[300]}`
                                    : `2px solid ${theme.colors.border}`,
                                background: active
                                    ? theme.colors.textOnAccent
                                    : 'transparent',
                                transition: 'all 160ms ease',
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: theme.spacing.xs,
                                    fontWeight: 600,
                                    color: theme.colors.text,
                                }}
                            >
                                {option.icon && (
                                    <span
                                        aria-hidden
                                        style={{
                                            color: theme.colors.textMuted,
                                        }}
                                    >
                                        {option.icon}
                                    </span>
                                )}
                                {option.label}
                            </span>
                            {option.description && (
                                <span
                                    style={{
                                        display: 'block',
                                        marginTop: 4,
                                        color: theme.colors.textMuted,
                                        fontSize: theme.typography.textSizes.sm,
                                    }}
                                >
                                    {option.description}
                                </span>
                            )}
                        </div>
                        <input
                            type='radio'
                            name={name}
                            value={option.value}
                            checked={active}
                            onChange={() => handleSelect(option.value)}
                            disabled={disabled}
                            style={{
                                position: 'absolute',
                                opacity: 0,
                                pointerEvents: 'none',
                            }}
                        />
                    </label>
                )
            })}
        </div>
    )
}
