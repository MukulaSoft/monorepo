import type { AccountState } from '../types/account'

export const initialAccountState: AccountState = {
  profile: {
    displayName: 'Maya Lumen',
    username: 'maya.lumen',
    bio: 'Designing adaptive listening rooms and leading the Pulse recommender squad.',
    avatarUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=240&q=80',
    email: 'maya.lumen@mukulasoft.com',
    timezone: 'America/Los_Angeles',
    pronouns: 'she/her',
    focusRoles: ['Identity platform lead', 'Pulse recommender research'],
    preferredGenres: ['Downtempo', 'Organic house', 'Indietronica'],
  },
  security: {
    twoFactorEnabled: true,
    passkeyEnabled: true,
    passkeyLabel: 'MukulaSoft IdP · Studio MBP',
    backupCodesRemaining: 6,
    lastPasswordChange: '2025-08-14T08:12:00Z',
    loginAlerts: true,
    devices: [
      {
        id: 'primary-mbp',
        label: 'MacBook Pro · Studio',
        location: 'Los Angeles, US',
        lastActive: '2025-12-01T08:00:00Z',
        trusted: true,
      },
      {
        id: 'pixel-9',
        label: 'Pixel 9 Pro',
        location: 'Silver Lake, US',
        lastActive: '2025-11-29T13:40:00Z',
        trusted: true,
      },
      {
        id: 'hotel-lobby',
        label: 'Venue kiosk',
        location: 'Berlin, DE',
        lastActive: '2025-11-20T19:22:00Z',
        trusted: false,
      },
    ],
  },
  notifications: [
    {
      id: 'account_activity',
      title: 'Account & security',
      description: 'Logins, recovery attempts, and policy alerts.',
      cadence: 'realtime',
      channels: { email: true, push: true, sms: false },
    },
    {
      id: 'recommender_reports',
      title: 'Recommender performance',
      description: 'Daily signal diffs and playlist delivery summaries.',
      cadence: 'daily',
      channels: { email: true, push: false, sms: false },
    },
    {
      id: 'collaboration',
      title: 'Team collaboration',
      description: 'Mentions, approvals, and shared workspace updates.',
      cadence: 'realtime',
      channels: { email: false, push: true, sms: false },
    },
    {
      id: 'digest',
      title: 'Weekly identity digest',
      description: 'Sunday briefing with profile metrics and trust posture.',
      cadence: 'weekly',
      channels: { email: true, push: false, sms: false },
    },
  ],
  integrations: [
    {
      id: 'spotify',
      title: 'Spotify',
      status: 'connected',
      plan: 'Premium Artist',
      connectedAt: '2025-07-02T10:00:00Z',
      lastSync: '2025-12-01T06:45:00Z',
      scopes: ['user-library-read', 'playlist-modify-private', 'user-read-recently-played'],
    },
    {
      id: 'youtube',
      title: 'YouTube Music',
      status: 'action_required',
      lastSync: '2025-11-27T18:10:00Z',
      scopes: ['ytm.playlist.read', 'ytm.analytics.readonly'],
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Sunday Evening Blend',
      description:
        'Downtempo set tuned to 92 BPM with spotlight transitions for ambient choreography blocks.',
      confidence: 0.84,
      source: 'spotify',
      signals: ['recent_mixes', 'liked_artists', 'heart_rate_windows'],
    },
    {
      id: 'rec-2',
      title: 'Creator QA Sprint',
      description:
        'Crossfade indie-electronica queue to pilot the new stories to playlist feedback loop.',
      confidence: 0.73,
      source: 'youtube',
      signals: ['collab_room_activity', 'playlist_comments'],
    },
    {
      id: 'rec-3',
      title: 'Late Night Signal Scan',
      description:
        'Curate 3 contrast-heavy mixes for the recommender benchmark w/ neurodivergent testers.',
      confidence: 0.69,
      source: 'spotify',
      signals: ['team_shared_links', 'energy_curve_gaps'],
    },
  ],
}
