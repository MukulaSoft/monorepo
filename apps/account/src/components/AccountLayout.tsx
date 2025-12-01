import { NavLink, Outlet } from 'react-router-dom'

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
        <Outlet />
      </main>
    </div>
  )
}
