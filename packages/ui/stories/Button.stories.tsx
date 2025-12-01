import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'primary',
    children: 'Click me',
  },
  parameters: {
    backgrounds: { default: 'surface' },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost button',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="ms-stack ms-stack--compact">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}
