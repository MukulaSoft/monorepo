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
import { LedgerStatus, ledgerService, songRecommenderService } from './services'

const TIMELINE = songRecommenderService.getTimelinePhases()
const SONG_CARDS = songRecommenderService.getRecommendedSongs()
const SONG_SCENARIO = songRecommenderService.getScenarioBlueprint()
const SONG_BADGE = songRecommenderService.getSignalBadgeLabel()

const NOTE_PANEL = ledgerService.getWorkspacePanels()
const LEDGER_ROWS = ledgerService.getStreams()
const GRID_METRICS = ledgerService.getGridMetrics()

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
          <span className="pill">{SONG_BADGE}</span>
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
              <TextField label="Event" placeholder={SONG_SCENARIO.eventLabel} />
              <div className="tw-flex tw-flex-col tw-gap-2">
                <span className="tw-text-muted">Mood palette</span>
                <div className="hero__actions">
                  {SONG_SCENARIO.moodPalette.map((preset) => (
                    <Chip key={preset.label} label={preset.label} active={preset.active} />
                  ))}
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-gap-2">
                <span className="tw-text-muted">Energy windows</span>
                <div className="hero__actions">
                  {SONG_SCENARIO.energyWindows.map((window) => (
                    <Chip key={window.label} label={window.label} active={window.active} />
                  ))}
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

function cnStatus(state: LedgerStatus) {
  const tone = ledgerService.describeStatusTone(state)
  if (tone === 'critical') return 'note-table__status note-table__status--blocked'
  if (tone === 'warning') return 'note-table__status note-table__status--stuck'
  return 'note-table__status'
}

export default App
