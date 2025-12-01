export type NotePanelCard = {
  title: string
  body: string
}

export type LedgerStatus = 'active' | 'blocked' | 'stuck'

export type LedgerRow = {
  title: string
  owner: string
  status: LedgerStatus
}

export type LedgerMetric = {
  label: string
  value: string
}

const NOTE_PANEL: NotePanelCard[] = [
  { title: 'Release retro', body: 'Summaries + linked actions for the last 4 deployments.' },
  { title: 'Influence matrix', body: 'Cross-team shout-outs mapped to Impact × Effort quadrants.' },
  { title: 'Mix recipes', body: 'EQ, pedals, and layering settings for studio + live versions.' },
]

const LEDGER_ROWS: LedgerRow[] = [
  { title: 'Chorus automation', owner: 'Claire', status: 'active' },
  { title: 'Sample clearance board', owner: 'Rahul', status: 'blocked' },
  { title: 'Backstage merch grid', owner: 'Marta', status: 'active' },
  { title: 'Residency calendar', owner: 'Samuel', status: 'stuck' },
]

const GRID_METRICS: LedgerMetric[] = [
  { label: 'Sessions', value: '148' },
  { label: 'Ideas linked', value: '982' },
  { label: 'Clips', value: '312' },
  { label: 'Tempo avg', value: '112 BPM' },
  { label: 'Notes/day', value: '38' },
  { label: 'Playlists', value: '26' },
]

export class LedgerService {
  getWorkspacePanels(): NotePanelCard[] {
    return NOTE_PANEL
  }

  getStreams(): LedgerRow[] {
    return LEDGER_ROWS
  }

  getGridMetrics(): LedgerMetric[] {
    return GRID_METRICS
  }

  describeStatusTone(status: LedgerStatus): 'default' | 'warning' | 'critical' {
    if (status === 'blocked') return 'critical'
    if (status === 'stuck') return 'warning'
    return 'default'
  }
}

export const ledgerService = new LedgerService()
