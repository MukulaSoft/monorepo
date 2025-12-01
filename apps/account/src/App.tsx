import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AccountProvider } from './context/account-context'
import { AccountLayout } from './components/AccountLayout'
import { ProfileForm } from './features/profile/ProfileForm'
import { SecuritySettings } from './features/security/SecuritySettings'
import { NotificationPreferences } from './features/notifications/NotificationPreferences'
import { StreamingConnections } from './features/connections/StreamingConnections'
import { RecommendationPanel } from './features/recommendations/RecommendationPanel'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AccountProvider>
        <AccountLayout />
      </AccountProvider>
    ),
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <ProfileForm /> },
      { path: 'security', element: <SecuritySettings /> },
      { path: 'notifications', element: <NotificationPreferences /> },
      { path: 'connections', element: <StreamingConnections /> },
      { path: 'recommendations', element: <RecommendationPanel /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
