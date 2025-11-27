'use client'

import { Card } from '@mukulasoft/ui'
import styles from '../../styles/RecommendationsSkeleton.module.css'

type SkeletonBlockProps = {
    width: number | string
    height: number
    borderRadius?: number
}

function SkeletonBlock({
    width,
    height,
    borderRadius = 6,
}: SkeletonBlockProps) {
    return (
        <div
            className={styles.skeletonBlock}
            style={{ width, height, borderRadius }}
        />
    )
}

export function RecommendationsSkeleton() {
    const placeholders = Array.from({ length: 3 })
    return (
        <section className={styles.section}>
            <header>
                <h3 className={styles.title}>Warming up your mix…</h3>
                <p className={styles.description}>
                    We&apos;re resolving your seed into catalog tracks and
                    ranking similar vibes.
                </p>
            </header>
            <div className={styles.grid}>
                {placeholders.map((_, index) => (
                    <Card key={`skeleton-${index}`} className={styles.card}>
                        <div className={styles.cardContent}>
                            <div className={styles.trackRow}>
                                <SkeletonBlock
                                    width={64}
                                    height={64}
                                    borderRadius={8}
                                />
                                <div className={styles.trackMeta}>
                                    <SkeletonBlock width='80%' height={14} />
                                    <SkeletonBlock width='60%' height={12} />
                                    <SkeletonBlock width='50%' height={10} />
                                </div>
                            </div>
                            <SkeletonBlock
                                width='100%'
                                height={36}
                                borderRadius={8}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}
