import type { Meta, StoryObj } from '@storybook/react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../src'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <div className="tw-flex tw-gap-2 tw-items-center">
          <Badge tone="info" variant="soft">
            beta
          </Badge>
          <Badge tone="success" variant="outline">
            automation
          </Badge>
        </div>
        <CardTitle>Release automation</CardTitle>
        <CardDescription>
          Track semantic-release jobs, GitHub Packages publishes, and audit tokens in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="tw-flex tw-justify-between tw-items-center">
          <p className="tw-text-muted">Next run</p>
          <strong>Tonight, 02:00 UTC</strong>
        </div>
        <div className="tw-flex tw-justify-between tw-items-center">
          <p className="tw-text-muted">Last status</p>
          <strong>Healthy</strong>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="ghost">
          View logs
        </Button>
        <Button size="sm">Trigger run</Button>
      </CardFooter>
    </Card>
  ),
}
