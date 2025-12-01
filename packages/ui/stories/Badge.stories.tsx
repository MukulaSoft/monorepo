import type { Meta, StoryObj } from '@storybook/react'
import { Badge, type BadgeProps } from '../src'

const TONES: BadgeProps['tone'][] = ['neutral', 'info', 'success', 'warning', 'danger']

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => (
    <div className="ms-stack">
      {TONES.map((tone) => (
        <div key={tone} className="tw-flex tw-gap-3">
          <Badge tone={tone} variant="soft">
            {tone} soft
          </Badge>
          <Badge tone={tone} variant="solid">
            {tone} solid
          </Badge>
          <Badge tone={tone} variant="outline">
            {tone} outline
          </Badge>
        </div>
      ))}
    </div>
  ),
}
