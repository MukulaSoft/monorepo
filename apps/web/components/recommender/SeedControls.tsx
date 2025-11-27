'use client'

import { Field, Input, Switch } from '@mukulasoft/ui'
import type {
    RecommendationMode,
    RecommendationSeedType,
} from '@mukulasoft/utils'
import styles from '../../styles/SeedControls.module.css'

export type SeedControlsProps = {
    mode: RecommendationMode
    personalizedLabel: string
    linkedDisabled: boolean
    linkedHelper: string | null
    onModeChange: (mode: RecommendationMode) => void
    seedType: RecommendationSeedType
    onSeedTypeChange: (value: RecommendationSeedType) => void
    limit: number
    onLimitChange: (value: number) => void
}

export function SeedControls({
    mode,
    personalizedLabel,
    linkedDisabled,
    linkedHelper,
    onModeChange,
    seedType,
    onSeedTypeChange,
    limit,
    onLimitChange,
}: SeedControlsProps) {
    const isPersonalized = mode === 'linked'

    return (
        <div className={styles.wrapper}>
            <Field label='Mode' hint={linkedHelper ?? undefined}>
                <div className={styles.modeRow}>
                    <div className={styles.modeColumn}>
                        <span className={styles.modeLabel}>Guest</span>
                        <small className={styles.modeHelper}>
                            Broad sonic matches
                        </small>
                    </div>
                    <Switch
                        checked={isPersonalized}
                        onCheckedChange={(checked) =>
                            onModeChange(checked ? 'linked' : 'guest')
                        }
                        disabled={linkedDisabled}
                    />
                    <div className={styles.modeColumn}>
                        <span className={styles.modeLabel}>
                            {personalizedLabel}
                        </span>
                        <small className={styles.modeHelper}>
                            Applies your linked taste
                        </small>
                    </div>
                </div>
            </Field>

            <Field label='Seed type'>
                <select
                    value={seedType}
                    onChange={(event) =>
                        onSeedTypeChange(
                            event.target.value as RecommendationSeedType,
                        )
                    }
                    className={styles.select}
                >
                    <option value='track'>Track</option>
                    <option value='playlist'>Playlist</option>
                </select>
            </Field>

            <Field label='How many' hint='Between 5 and 50 recommendations'>
                <Input
                    type='number'
                    min={5}
                    max={50}
                    value={limit}
                    onChange={(event) =>
                        onLimitChange(Number(event.target.value))
                    }
                />
            </Field>
        </div>
    )
}
