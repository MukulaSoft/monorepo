import { Card, mukulaTheme } from '@mukulasoft/ui'

type FlashTone = 'success' | 'error'

type FlashMessage = { tone: FlashTone; text: string }

type Props = {
    message: FlashMessage
}

export function ConnectionFlash({ message }: Props) {
    const accent =
        message.tone === 'success'
            ? {
                  border: '1px solid #1DB95455',
                  background:
                      'linear-gradient(120deg, rgba(29,185,84,0.15), rgba(29,185,84,0.05))',
                  text: '#8ff0ae',
              }
            : {
                  border: '1px solid #ff7c7c55',
                  background:
                      'linear-gradient(120deg, rgba(255,92,92,0.2), rgba(255,92,92,0.05))',
                  text: '#ffbdbd',
              }

    return (
        <Card style={{ border: accent.border, background: accent.background }}>
            <p style={{ margin: 0, color: accent.text, fontWeight: 600 }}>
                {message.text}
            </p>
        </Card>
    )
}

export type { FlashMessage, FlashTone }
