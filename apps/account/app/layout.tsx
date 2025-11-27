import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { AppProviders } from '@account/core/providers/AppProviders'

export const metadata: Metadata = {
    title: 'MukulaSoft - Account',
    description: 'Account and settings for MukulaSoft.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    )
}
