import type { ReactNode } from 'react'

type PageHeaderProps = {
    title: string
    description?: string
    actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <header
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                marginBottom: '1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                }}
            >
                <h1 style={{ fontSize: '1.7rem', margin: 0 }}>{title}</h1>
                {description && (
                    <p style={{ margin: 0, color: '#546173' }}>{description}</p>
                )}
            </div>
            {actions && <div>{actions}</div>}
        </header>
    )
}
