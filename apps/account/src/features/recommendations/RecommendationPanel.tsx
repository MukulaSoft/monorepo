import { Badge, Button } from '@mukulasoft/ui'
import { useAccount } from '../../context/account-context'

export function RecommendationPanel() {
  const { recommendations, integrations, actions } = useAccount()

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Personalized recommendations</h2>
          <p>Stitched from Spotify + YouTube Music signals plus your identity graph.</p>
        </div>
        <Button onClick={() => actions.refreshRecommendations()}>Refresh signals</Button>
      </header>

      <div className="recommendation-grid">
        {recommendations.map((item) => (
          <article key={item.id} className="recommendation-card">
            <div className="recommendation-card__meta">
              <Badge tone="info" variant="outline">
                {item.source === 'spotify' ? 'Spotify' : 'YouTube Music'}
              </Badge>
              <span>{Math.round(item.confidence * 100)}% confidence</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="recommendation-card__signals">
              {item.signals.map((signal) => (
                <span key={signal} className="pill pill--muted">
                  {signal.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <footer className="recommendation-footer">
        <h3>Connection health</h3>
        <div className="connection-health">
          {integrations.map((integration) => (
            <div key={integration.id}>
              <strong>{integration.title}</strong>
              <p>{integration.status === 'connected' ? 'In sync' : 'Needs attention'}</p>
            </div>
          ))}
        </div>
      </footer>
    </section>
  )
}
