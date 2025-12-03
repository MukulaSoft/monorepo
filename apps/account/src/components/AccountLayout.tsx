import { Button } from '@mukulasoft/ui'
import { NavLink, Outlet } from 'react-router-dom'
import { useAccount } from '../context/account-context'

const NAV_ITEMS = [
  {
    path: 'profile',
    label: 'Profile',
    description: 'Public identity, roles, and presence.',
  },
  {
    path: 'security',
    label: 'Security',
    description: '2FA, devices, and trust posture.',
  },
  {
    path: 'notifications',
    label: 'Notifications',
    description: 'Signals and cadences across channels.',
  },
  {
    path: 'connections',
    label: 'Connections',
    description: 'Spotify + YouTube Music link management.',
  },
  {
    path: 'recommendations',
    label: 'Recommendations',
    description: 'Personalized music + workflow nudges.',
  },
]

export function AccountLayout() {
  const { hydration, actions } = useAccount()

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <header className="layout__hero">
          <span className="eyebrow">MukulaSoft Account</span>
          <h1>Identity control surface</h1>
          <p>Configure how you show up across profile, trust, and recommender systems.</p>
        </header>
        <nav className="layout__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'nav-card nav-card--active' : 'nav-card')}
            >
              <div>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="layout__content">
        <HydrationBanner hydration={hydration} onRetry={actions.reloadAccount} />
        <Outlet />
      </main>
    </div>
  )
}

type HydrationBannerProps = {
  hydration: ReturnType<typeof useAccount>['hydration']
  onRetry: () => Promise<void>
}

function HydrationBanner({ hydration, onRetry }: HydrationBannerProps) {
  if (hydration.status === 'ready') return null

  const isError = hydration.status === 'error'
  const isLoading = hydration.status === 'loading'
  const statusLabel = isError
    ? 'Sync failed'
    : isLoading
      ? 'Hydrating account'
      : 'Syncing latest data'
  const description = isError
    ? (hydration.error ?? 'Unable to load account data.')
    : isLoading
      ? 'Loading account details from MukulaSoft Cloud.'
      : 'Refreshing account details with your latest activity.'

  const role = isError ? 'alert' : 'status'
  const ariaLive = isError ? 'assertive' : 'polite'

  return (
    <div
      className={`hydration-banner ${isError ? 'hydration-banner--error' : 'hydration-banner--active'}`}
      role={role}
      aria-live={ariaLive}
    >
      <div className="hydration-banner__status">
        <span
          className={
            isError
              ? 'hydration-banner__indicator hydration-banner__indicator--error'
              : 'hydration-banner__indicator'
          }
          aria-hidden="true"
        />
        <div>
          <strong>{statusLabel}</strong>
          <p>{description}</p>
        </div>
      </div>
      {isError ? (
        <Button variant="ghost" size="sm" onClick={() => void onRetry()}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}
