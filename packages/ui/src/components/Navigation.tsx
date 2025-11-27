'use client'

import * as React from 'react'

import { useTheme } from '../ThemeProvider'

type NavigationLinkProps = React.PropsWithChildren<{
    href: string
    style?: React.CSSProperties
    className?: string
    'aria-current'?: React.AriaAttributes['aria-current']
}>

type NavigationLinkComponent = React.ComponentType<NavigationLinkProps>

export type NavigationItem = {
    label: string
    href: string
    active?: boolean
    external?: boolean
    description?: string
    badge?: string | number
    icon?: React.ReactNode
}

const DefaultLink: NavigationLinkComponent = ({
    href,
    children,
    style,
    className,
    ...rest
}) => (
    <a href={href} style={style} className={className} {...rest}>
        {children}
    </a>
)

type NavigationBarProps = {
    brand?: React.ReactNode
    items?: NavigationItem[]
    actions?: React.ReactNode
    linkComponent?: NavigationLinkComponent
    position?: 'static' | 'sticky'
    variant?: 'floating' | 'bordered'
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
    brand,
    items = [],
    actions,
    linkComponent,
    position = 'sticky',
    variant = 'floating',
}) => {
    const theme = useTheme()
    const LinkComponent = linkComponent ?? DefaultLink

    const containerStyles: React.CSSProperties = {
        maxWidth: theme.layout.contentWidth,
        margin: '0 auto',
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
    }

    const barStyles: React.CSSProperties = {
        borderRadius: theme.radii.pill,
        border:
            variant === 'floating'
                ? `1px solid ${theme.colors.borderStrong}`
                : `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        background:
            variant === 'floating'
                ? 'rgba(15, 23, 42, 0.8)'
                : theme.colors.backgroundAlt,
        boxShadow:
            variant === 'floating'
                ? '0 30px 80px rgba(15, 23, 42, 0.45)'
                : theme.shadows.subtle,
        backdropFilter: 'blur(18px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
    }

    return (
        <header
            style={{
                position: position === 'sticky' ? 'sticky' : 'static',
                top: 0,
                zIndex: 30,
                background:
                    position === 'sticky'
                        ? 'rgba(15, 23, 42, 0.75)'
                        : undefined,
                borderBottom:
                    position === 'sticky'
                        ? `1px solid ${theme.colors.border}`
                        : undefined,
                backdropFilter:
                    position === 'sticky' ? 'blur(22px)' : undefined,
            }}
        >
            <div style={containerStyles}>
                <div style={barStyles}>
                    {brand && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: theme.spacing.xs,
                                fontWeight: 700,
                                color: theme.colors.text,
                            }}
                        >
                            <span
                                aria-hidden
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: theme.colors.accent[400],
                                    boxShadow: `0 0 0 6px rgba(34, 211, 238, 0.15)`,
                                }}
                            />
                            {brand}
                        </div>
                    )}
                    <nav
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing.sm,
                            flex: 1,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {items.map((item) => {
                            const active = Boolean(item.active)
                            const ItemLink = item.external
                                ? DefaultLink
                                : LinkComponent

                            return (
                                <ItemLink
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    style={{
                                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                                        borderRadius: theme.radii.pill,
                                        border: active
                                            ? `1px solid ${theme.colors.accent[300]}`
                                            : `1px solid transparent`,
                                        background: active
                                            ? 'linear-gradient(120deg, rgba(139,92,246,0.25), rgba(34,211,238,0.25))'
                                            : 'rgba(148, 163, 184, 0.08)',
                                        color: theme.colors.text,
                                        textDecoration: 'none',
                                        fontWeight: active ? 700 : 600,
                                        letterSpacing: 0.2,
                                        boxShadow: active
                                            ? '0 12px 30px rgba(34, 211, 238, 0.25)'
                                            : 'none',
                                        transition:
                                            'background 160ms ease, border-color 160ms ease, transform 160ms ease',
                                        transform: active
                                            ? 'translateY(-1px)'
                                            : undefined,
                                    }}
                                >
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span
                                            style={{
                                                marginLeft: theme.spacing.xs,
                                                padding: '0 0.4rem',
                                                borderRadius: theme.radii.pill,
                                                fontSize:
                                                    theme.typography.textSizes
                                                        .xs,
                                                background:
                                                    'rgba(148,163,184,0.35)',
                                                color: theme.colors.text,
                                            }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </ItemLink>
                            )
                        })}
                    </nav>
                    {actions && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: theme.spacing.sm,
                            }}
                        >
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

type NavigationListProps = {
    title?: string
    items: NavigationItem[]
    linkComponent?: NavigationLinkComponent
}

export const NavigationList: React.FC<NavigationListProps> = ({
    title,
    items,
    linkComponent,
}) => {
    const theme = useTheme()
    const LinkComponent = linkComponent ?? DefaultLink

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xs,
            }}
        >
            {title && (
                <p
                    style={{
                        margin: 0,
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.textSizes.sm,
                        fontWeight: 600,
                        letterSpacing: 0.3,
                        textTransform: 'uppercase',
                    }}
                >
                    {title}
                </p>
            )}
            {items.map((item) => {
                const active = Boolean(item.active)
                const ItemLink = item.external ? DefaultLink : LinkComponent

                return (
                    <ItemLink
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        style={{
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            borderRadius: theme.radii.md,
                            textDecoration: 'none',
                            color: theme.colors.text,
                            background: active
                                ? 'rgba(139,92,246,0.15)'
                                : 'rgba(148,163,184,0.08)',
                            border: active
                                ? `1px solid ${theme.colors.accent[300]}`
                                : `1px solid transparent`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing.sm,
                            transition:
                                'background 140ms ease, transform 140ms ease',
                            transform: active ? 'translateX(4px)' : undefined,
                        }}
                    >
                        {item.icon && (
                            <span
                                aria-hidden
                                style={{
                                    display: 'inline-flex',
                                    color: active
                                        ? theme.colors.accent[100]
                                        : theme.colors.textMuted,
                                }}
                            >
                                {item.icon}
                            </span>
                        )}
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.description && (
                            <span
                                style={{
                                    fontSize: theme.typography.textSizes.xs,
                                    color: theme.colors.textMuted,
                                }}
                            >
                                {item.description}
                            </span>
                        )}
                    </ItemLink>
                )
            })}
        </div>
    )
}

type NavigationRailProps = {
    items: NavigationItem[]
    linkComponent?: NavigationLinkComponent
    collapsed?: boolean
    header?: React.ReactNode
    footer?: React.ReactNode
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
    items,
    linkComponent,
    collapsed = false,
    header,
    footer,
}) => {
    const theme = useTheme()
    const LinkComponent = linkComponent ?? DefaultLink

    const width = collapsed ? 72 : 220

    return (
        <aside
            style={{
                width,
                borderRight: `1px solid ${theme.colors.border}`,
                background: theme.colors.surfaceMuted,
                padding: theme.spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md,
                position: 'sticky',
                top: 0,
                height: '100vh',
            }}
        >
            {header && <div>{header}</div>}
            <nav
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.sm,
                }}
            >
                {items.map((item) => {
                    const active = Boolean(item.active)
                    const ItemLink = item.external ? DefaultLink : LinkComponent

                    return (
                        <ItemLink
                            key={item.href}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: collapsed ? 0 : theme.spacing.sm,
                                justifyContent: collapsed
                                    ? 'center'
                                    : 'flex-start',
                                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                borderRadius: theme.radii.md,
                                textDecoration: 'none',
                                color: theme.colors.text,
                                background: active
                                    ? 'rgba(139,92,246,0.2)'
                                    : 'transparent',
                                border: active
                                    ? `1px solid ${theme.colors.accent[300]}`
                                    : '1px solid transparent',
                                fontWeight: active ? 600 : 500,
                            }}
                        >
                            {item.icon && (
                                <span
                                    aria-hidden
                                    style={{
                                        color: active
                                            ? theme.colors.accent[100]
                                            : theme.colors.textMuted,
                                    }}
                                >
                                    {item.icon}
                                </span>
                            )}
                            {!collapsed && <span>{item.label}</span>}
                        </ItemLink>
                    )
                })}
            </nav>
            {footer && <div>{footer}</div>}
        </aside>
    )
}
