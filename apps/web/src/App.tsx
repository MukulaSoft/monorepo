import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  TextField,
  usePrefersReducedMotion,
} from '@mukulasoft/ui'
import './App.css'

const TIMELINE = [
  {
    phase: 'Dawn',
    label: 'Unified homepage',
    detail: 'A single launchpad for discovery, creator tooling, and playlists built for mood.',
  },
  {
    phase: 'Pulse',
    label: 'Song recommender',
    detail: 'Blend lyrics, BPM, and crowd energy to assemble shareable, multi-scene queues.',
  },
  {
    phase: 'Ledger',
    label: 'Note workspace',
    detail: 'An Obsidian-inspired canvas with Excel-grade tables for release rituals.',
  },
]

const SONG_CARDS = [
  {
    title: 'Nocturne Grid',
    artist: 'Alina Mire',
    bpm: 96,
    energy: 'Late night synth',
    tag: 'Focus',
  },
  {
    title: 'Verdant Runners',
    artist: 'Revolving Light',
    bpm: 122,
    energy: 'Organic house',
    tag: 'Momentum',
  },
  {
    title: 'Hushed Glass',
    artist: 'Iver + Vale',
    bpm: 82,
    energy: 'Analog lo-fi',
    tag: 'Deep Work',
  },
  { title: 'Neon Canopy', artist: 'Still North', bpm: 134, energy: 'Vibrant indie', tag: 'Sprint' },
]

const NOTE_PANEL = [
  { title: 'Release retro', body: 'Summaries + linked actions for the last 4 deployments.' },
  { title: 'Influence matrix', body: 'Cross-team shout-outs mapped to Impact × Effort quadrants.' },
  { title: 'Mix recipes', body: 'EQ, pedals, and layering settings for studio + live versions.' },
]

const LEDGER_ROWS = [
  { title: 'Chorus automation', owner: 'Claire', status: 'active' },
  { title: 'Sample clearance board', owner: 'Rahul', status: 'blocked' },
  { title: 'Backstage merch grid', owner: 'Marta', status: 'active' },
  { title: 'Residency calendar', owner: 'Samuel', status: 'stuck' },
]

const GRID_METRICS = [
  { label: 'Sessions', value: '148' },
  { label: 'Ideas linked', value: '982' },
  { label: 'Clips', value: '312' },
  { label: 'Tempo avg', value: '112 BPM' },
  { label: 'Notes/day', value: '38' },
  { label: 'Playlists', value: '26' },
]

type ChipProps = {
  label: string
  active?: boolean
}

const Chip = ({ label, active }: ChipProps) => (
  <button type="button" className={active ? 'pill' : 'pill pill--muted'}>
    {label}
  </button>
)

function App() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="app-shell tw-container">
      <header className="hero">
        <span className="hero__eyebrow">MukulaSoft Studios</span>
        <h1 className="hero__title">Home, Harmony, and Hyperstructure in One Canvas</h1>
        <p className="hero__subtitle">
          A multi-surface experience for artists and builders. Draft landing pages, audition music
          companions, and run note-led rituals with the same visual language.
        </p>
        <div className="hero__actions">
          <Button size="lg">Launch studio</Button>
          <Button variant="ghost">Schedule walkthrough</Button>
        </div>
      </header>

      <section className="glass-panel">
        <div className="section-header">
          <h2>Storyline</h2>
          <Badge tone="info" variant="soft">
            {prefersReducedMotion ? 'Calm mode' : 'Live prototype'}
          </Badge>
        </div>
        <div className="timeline">
          {TIMELINE.map((item) => (
            <div key={item.phase} className="timeline__item">
              <div>
                <p className="timeline__phase">{item.phase}</p>
                <strong>{item.label}</strong>
              </div>
              <p className="timeline__body">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel">
        <div className="section-header">
          <h2>Pulse · Song Recommender</h2>
          <span className="pill">Signal Engine</span>
        </div>

        <div className="tw-grid tw-grid-auto-fit tw-gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Define your vibe</CardTitle>
              <CardDescription>
                Blend context & constraints to craft the next set list.
              </CardDescription>
            </CardHeader>
            <CardContent className="tw-flex tw-flex-col tw-gap-4">
              <TextField label="Event" placeholder="Night swim sound check" />
              <div className="tw-flex tw-flex-col tw-gap-2">
                <span className="tw-text-muted">Mood palette</span>
                <div className="hero__actions">
                  <Chip label="Deep focus" active />
                  <Chip label="Elation" />
                  <Chip label="Analog warm" />
                  <Chip label="Pulse" />
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-gap-2">
                <span className="tw-text-muted">Energy windows</span>
                <div className="hero__actions">
                  <Chip label="80 - 95 BPM" active />
                  <Chip label="100 - 115 BPM" />
                  <Chip label="Live acoustic" />
                  <Chip label="High contrast" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Randomize</Button>
              <Button>Generate queue</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready-made picks</CardTitle>
              <CardDescription>Curated across genres, deliverable to any room.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="song-grid">
                {SONG_CARDS.map((song) => (
                  <div key={song.title} className="song-card">
                    <div className="tw-flex tw-justify-between tw-items-center">
                      <strong>{song.title}</strong>
                      <Badge tone="neutral" variant="outline">
                        {song.tag}
                      </Badge>
                    </div>
                    <span>{song.artist}</span>
                    <span>
                      {song.bpm} BPM · {song.energy}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="glass-panel">
        <div className="section-header">
          <h2>Ledger · Obsidian meets Excel</h2>
          <span className="pill">Notes Operating System</span>
        </div>

        <div className="note-split">
          <div className="note-board">
            {NOTE_PANEL.map((panel) => (
              <div key={panel.title} className="note-panel">
                <h4>{panel.title}</h4>
                <p>{panel.body}</p>
              </div>
            ))}
          </div>

          <div className="note-table">
            <div className="note-table__row note-table__header">
              <span>Stream</span>
              <span>Owner</span>
              <span>Status</span>
            </div>
            {LEDGER_ROWS.map((row) => (
              <div key={row.title} className="note-table__row">
                <span>{row.title}</span>
                <span>{row.owner}</span>
                <span className="note-table__cell">
                  <span className={cnStatus(row.status)} aria-hidden="true" />
                  {row.status}
                </span>
              </div>
            ))}
            <div className="excel-grid" aria-hidden="true">
              {GRID_METRICS.map((metric) => (
                <div key={metric.label} className="excel-grid__cell">
                  <strong>{metric.value}</strong>
                  {metric.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function cnStatus(state: (typeof LEDGER_ROWS)[number]['status']) {
  if (state === 'blocked') return 'note-table__status note-table__status--blocked'
  if (state === 'stuck') return 'note-table__status note-table__status--stuck'
  return 'note-table__status'
}

export default App
