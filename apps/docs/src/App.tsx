import { Button, useToggle } from '@mukulasoft/ui'
import { clamp, isEmpty } from '@mukulasoft/utils'
import './App.css'

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
    <article className="package-card">
      <div>
        <h3>{meta.name}</h3>
        <p>{meta.description}</p>
      </div>
      <pre>{meta.install}</pre>
      <div className="package-commands">
        {meta.commands.map((command) => (
          <code key={command.command} aria-label={command.label}>
            {command.command}
          </code>
        ))}
      </div>
      <a className="package-link" href={meta.docsUrl} target="_blank" rel="noreferrer">
        View documentation ↗
      </a>
    </article>
  )
}

export default function App() {
  const toggleState = useToggle(false)

  return (
    <div className="App">
      <header>
        <p className="eyebrow">MukulaSoft Platform</p>
        <h1>Design System Packages</h1>
        <p className="lede">
          Reference implementations for UI primitives, hooks, and utility helpers. Everything ships
          through a single release pipeline backed by Changesets and GitHub Packages.
        </p>
        <div className="cta-row">
          <Button variant="primary" size="lg" onClick={toggleState.toggle}>
            Toggle live demo ({toggleState.value ? 'on' : 'off'})
          </Button>
          <Button variant="ghost" onClick={() => toggleState.set(false)}>
            Reset state
          </Button>
        </div>
      </header>

      <section>
        <h2>Packages</h2>
        <div className="packages-grid">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} meta={pkg} />
          ))}
        </div>
      </section>

      <section className="demo">
        <div>
          <h3>Clamp helper</h3>
          <p>Values are normalized to a 0–120 range:</p>
          <ul>
            {clampSamples.map((sample) => (
              <li key={sample.label}>
                <span>{sample.label}</span>
                <strong>{sample.clamped}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>isEmpty helper</h3>
          <p>Runtime guard results:</p>
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
