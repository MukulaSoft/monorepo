import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from '../src'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Project name',
    placeholder: 'Imagine Dragons',
    hint: 'Displayed in navigation menus',
  },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAffixes: Story = {
  args: {
    prefix: 'app/',
    suffix: '.msoft.dev',
    placeholder: 'release-hub',
    label: 'Subdomain',
  },
}

export const WithError: Story = {
  args: {
    error: 'Please enter between 3 and 32 characters',
    placeholder: 'release-hub',
  },
}
