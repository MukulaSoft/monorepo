import type { Preview } from '@storybook/react'
import '../styles.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#f8fafc' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '320px', padding: '2rem', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export default preview
