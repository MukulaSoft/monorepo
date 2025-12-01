export type TimelinePhase = {
  phase: string
  label: string
  detail: string
}

export type SongMoodPreset = {
  label: string
  active?: boolean
}

export type EnergyWindowPreset = {
  label: string
  active?: boolean
}

export type SongCard = {
  title: string
  artist: string
  bpm: number
  energy: string
  tag: string
}

export type ScenarioBlueprint = {
  eventLabel: string
  moodPalette: SongMoodPreset[]
  energyWindows: EnergyWindowPreset[]
}

const TIMELINE: TimelinePhase[] = [
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

const DEFAULT_SCENARIO: ScenarioBlueprint = {
  eventLabel: 'Night swim sound check',
  moodPalette: [
    { label: 'Deep focus', active: true },
    { label: 'Elation' },
    { label: 'Analog warm' },
    { label: 'Pulse' },
  ],
  energyWindows: [
    { label: '80 - 95 BPM', active: true },
    { label: '100 - 115 BPM' },
    { label: 'Live acoustic' },
    { label: 'High contrast' },
  ],
}

const SONG_CARDS: SongCard[] = [
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

export class SongRecommenderService {
  getTimelinePhases(): TimelinePhase[] {
    return TIMELINE
  }

  getScenarioBlueprint(): ScenarioBlueprint {
    return DEFAULT_SCENARIO
  }

  getRecommendedSongs(): SongCard[] {
    return SONG_CARDS
  }

  getSignalBadgeLabel(): string {
    return 'Signal Engine'
  }
}

export const songRecommenderService = new SongRecommenderService()
