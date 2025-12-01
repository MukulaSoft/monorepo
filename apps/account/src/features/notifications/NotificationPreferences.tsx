import { Button } from '@mukulasoft/ui'
import { useAccount } from '../../context/account-context'

const CHANNEL_LABELS = {
  email: 'Email',
  push: 'Push',
  sms: 'SMS',
} as const

export function NotificationPreferences() {
  const { notifications, actions } = useAccount()

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Notification settings</h2>
          <p>Blend realtime observability with calmer digests per surface.</p>
        </div>
        <Button
          variant="ghost"
          onClick={() =>
            notifications.forEach((pref) => actions.updateNotificationCadence(pref.id, 'weekly'))
          }
        >
          Quiet mode · Weekly
        </Button>
      </header>

      <div className="notification-grid">
        {notifications.map((preference) => (
          <article key={preference.id} className="notification-card">
            <div>
              <h3>{preference.title}</h3>
              <p>{preference.description}</p>
            </div>
            <div className="notification-card__controls">
              <label>
                <span>Cadence</span>
                <select
                  value={preference.cadence}
                  onChange={(event) =>
                    actions.updateNotificationCadence(
                      preference.id,
                      event.currentTarget.value as (typeof preference)['cadence'],
                    )
                  }
                >
                  <option value="realtime">Realtime</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly brief</option>
                </select>
              </label>
              <div className="pill-grid">
                {(Object.keys(CHANNEL_LABELS) as Array<keyof typeof CHANNEL_LABELS>).map(
                  (channel) => (
                    <button
                      key={channel}
                      type="button"
                      className={
                        preference.channels[channel] ? 'pill pill--active' : 'pill pill--muted'
                      }
                      onClick={() =>
                        actions.updateNotificationChannel(
                          preference.id,
                          channel,
                          !preference.channels[channel],
                        )
                      }
                    >
                      {CHANNEL_LABELS[channel]}
                    </button>
                  ),
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
