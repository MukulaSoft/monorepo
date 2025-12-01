import { Badge, Button } from '@mukulasoft/ui'
import { useAccount } from '../../context/account-context'
import type { Integration } from '../../types/account'

const SERVICE_DETAILS: Record<Integration['id'], { accent: string; description: string }> = {
  spotify: {
    accent: 'badge--spotify',
    description: 'Sync liked songs, playlists, and energy curves into the Pulse recommender.',
  },
  youtube: {
    accent: 'badge--youtube',
    description: 'Capture YouTube Music watch history for faster genre cold starts.',
  },
}

const STATUS_COPY: Record<Integration['status'], string> = {
  connected: 'Streaming data hourly',
  disconnected: 'Not connected',
  action_required: 'Needs re-authentication',
}

export function StreamingConnections() {
  const { integrations, actions } = useAccount()

  const handlePrimaryAction = (integration: Integration) => {
    if (integration.status === 'connected') {
      actions.disconnectIntegration(integration.id)
      return
    }
    actions.connectIntegration(integration.id)
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Streaming connections</h2>
          <p>Grant Spotify or YouTube Music scopes to unlock better recommendations.</p>
        </div>
        <Button variant="ghost">Add another service</Button>
      </header>

      <div className="connections-grid">
        {integrations.map((integration) => (
          <article key={integration.id} className="connection-card">
            <Badge tone="info" variant="soft" className={SERVICE_DETAILS[integration.id].accent}>
              {integration.title}
            </Badge>
            <h3>{STATUS_COPY[integration.status]}</h3>
            <p>{SERVICE_DETAILS[integration.id].description}</p>
            <dl>
              <div>
                <dt>Scopes</dt>
                <dd>{integration.scopes.join(', ')}</dd>
              </div>
              <div>
                <dt>Last sync</dt>
                <dd>
                  {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : '—'}
                </dd>
              </div>
            </dl>
            <div className="connection-card__actions">
              <Button onClick={() => handlePrimaryAction(integration)}>
                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
              </Button>
              {integration.status === 'action_required' ? (
                <Button variant="ghost" onClick={() => actions.connectIntegration(integration.id)}>
                  Re-authenticate
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
