import { Button, useToggle } from '@mukulasoft/ui'
import { clamp, isEmpty } from '@mukulasoft/utils'

type PackageMeta = {
  name: string
  description: string
  install: string
  docsUrl: string
  commands: { label: string; command: string }[]
}

const PACKAGES: PackageMeta[] = [
  {
    name: '@mukulasoft/ui',
    description: 'React primitives, headless hooks, and tokens-aware components.',
    install: 'pnpm add @mukulasoft/ui',
    docsUrl: 'https://github.com/MukulaSoft/monorepo/tree/master/packages/ui',
    commands: [
      { label: 'Dev', command: 'pnpm dev --filter @mukulasoft/ui' },
      { label: 'Lint', command: 'pnpm lint --filter @mukulasoft/ui' },
      { label: 'Test', command: 'pnpm test --filter @mukulasoft/ui' },
    ],
  },
  {
    name: '@mukulasoft/utils',
    description: 'Zero-dependency runtime helpers shared across services.',
    install: 'pnpm add @mukulasoft/utils',
    docsUrl: 'https://github.com/MukulaSoft/monorepo/tree/master/packages/utils',
    commands: [
      { label: 'Dev', command: 'pnpm dev --filter @mukulasoft/utils' },
      { label: 'Lint', command: 'pnpm lint --filter @mukulasoft/utils' },
      { label: 'Test', command: 'pnpm test --filter @mukulasoft/utils' },
    ],
  },
  {
    name: '@mukulasoft/design-tokens',
    description: 'Source-of-truth tokens consumed by UI libraries and apps.',
    install: 'pnpm add @mukulasoft/design-tokens',
    docsUrl: 'https://github.com/MukulaSoft/monorepo/tree/master/packages/design-tokens',
    commands: [{ label: 'Sync', command: 'pnpm build --filter @mukulasoft/design-tokens' }],
  },
]

const clampSamples = [-24, 0, 42, 96, 180].map((value) => ({
  label: value,
  clamped: clamp(value, 0, 120),
}))

const emptinessSamples = [
  { label: '"" (empty string)', value: '' },
  { label: '{ } (object)', value: {} },
  { label: '[] (array)', value: [] },
  { label: 'new Map()', value: new Map() },
]

function PackageCard({ meta }: { meta: PackageMeta }) {
  return (
    <article className="tw-card">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <h3 className="tw-heading-lg">{meta.name}</h3>
        <p className="tw-text-muted">{meta.description}</p>
      </div>
      <pre>{meta.install}</pre>
      <div className="tw-flex tw-flex-col tw-gap-2">
        {meta.commands.map((command) => (
          <code key={command.command} aria-label={command.label} className="tw-command">
            {command.command}
          </code>
        ))}
      </div>
      <a className="tw-link" href={meta.docsUrl} target="_blank" rel="noreferrer">
        View documentation ↗
      </a>
    </article>
  )
}

export default function App() {
  const toggleState = useToggle(false)

  return (
    <div className="tw-container">
      <header className="tw-flex tw-flex-col tw-gap-4">
        <p className="tw-pill">MukulaSoft Platform</p>
        <h1 className="tw-heading-xl">Design System Packages</h1>
        <p className="tw-text-lead tw-text-muted">
          Reference implementations for UI primitives, hooks, and utility helpers. Everything ships
          through a single release pipeline backed by semantic-release and GitHub Packages.
        </p>
        <div className="tw-flex tw-flex-wrap tw-gap-3">
          <Button variant="primary" size="lg" onClick={toggleState.toggle}>
            Toggle live demo ({toggleState.value ? 'on' : 'off'})
          </Button>
          <Button variant="ghost" onClick={() => toggleState.set(false)}>
            Reset state
          </Button>
        </div>
      </header>

      <section className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-flex-col tw-gap-2">
          <h2 className="tw-heading-lg">Packages</h2>
          <p className="tw-text-muted">
            Each workspace ships with linting, Vitest coverage thresholds, and GitHub Packages-ready
            metadata.
          </p>
        </div>
        <div className="tw-grid tw-grid-auto-fit tw-gap-4">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} meta={pkg} />
          ))}
        </div>
      </section>

      <section className="tw-demo-panel">
        <div className="tw-flex tw-flex-col tw-gap-3">
          <h3 className="tw-heading-lg">Clamp helper</h3>
          <p className="tw-text-muted">Values normalized to a 0–120 range:</p>
          <ul>
            {clampSamples.map((sample) => (
              <li key={sample.label}>
                <span>{sample.label}</span>
                <strong>{sample.clamped}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-3">
          <h3 className="tw-heading-lg">isEmpty helper</h3>
          <p className="tw-text-muted">Runtime guard results:</p>
          <ul>
            {emptinessSamples.map((sample) => (
              <li key={sample.label}>
                <span>{sample.label}</span>
                <strong>{isEmpty(sample.value) ? 'true' : 'false'}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
