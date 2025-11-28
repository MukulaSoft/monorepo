'use client'

import Link from 'next/link'
import { Card, LayoutShell } from '@mukulasoft/ui'
import { RecommenderNavigation } from './RecommenderNavigation'
import styles from '../styles/home.module.css'

const serviceModules = [
    {
        name: 'Song recommender',
        status: 'Live now',
        description:
            'Search, personalize, and export mixes powered by MukulaSoft data contracts and taste models.',
        href: '/#recommender',
    },
]

const roadmapHighlights = [
    'First-class operations dashboard for curators and promotions teams.',
    'Webhook + GraphQL APIs so you can automate delivery to any downstream client.',
    'AI-assisted QA to flag metadata gaps before you publish playlists or lineups.',
]

export function HomeScreen() {
    return (
        <LayoutShell>
            <RecommenderNavigation />
            <main className={styles.mainContent}>
                <section className={styles.heroSection}>
                    <div className={styles.heroCopy}>
                        <p className={styles.eyebrow}>MukulaSoft platform</p>
                        <h1 className={styles.heroTitle}>
                            Build every media touchpoint from one platform
                        </h1>
                        <p className={styles.heroDescription}>
                            Product, data, and programming teams use MukulaSoft
                            to explore catalogs, wire up telemetry, and ship
                            differentiated listening experiences that feel
                            cohesive everywhere.
                        </p>
                        <div className={styles.heroActions}>
                            <Link
                                href='/#recommender'
                                className={styles.primaryCta}
                            >
                                Launch the recommender
                            </Link>
                        </div>
                        <p className={styles.heroHint}>
                            Recommender is only the beginning—each module plugs
                            into the same auth, data, and observability spine.
                        </p>
                    </div>
                </section>

                <section className={styles.servicesSection}>
                    <header className={styles.servicesHeader}>
                        <p className={styles.badge}>Product lineup</p>
                        <h2>What the platform delivers</h2>
                        <p>
                            Today you can launch the recommender; soon, you can
                            orchestrate signals, automate programming, and feed
                            any surface using the same toolkit.
                        </p>
                    </header>
                    <div className={styles.servicesGrid}>
                        {serviceModules.map((module) => (
                            <Card
                                key={module.name}
                                className={styles.serviceCard}
                            >
                                <div className={styles.serviceMeta}>
                                    <span className={styles.serviceStatus}>
                                        {module.status}
                                    </span>
                                    <h3>{module.name}</h3>
                                </div>
                                <p>{module.description}</p>
                                <Link
                                    href={module.href}
                                    className={styles.serviceLink}
                                >
                                    {module.status === 'Live now'
                                        ? 'Open workspace'
                                        : 'Request access'}
                                </Link>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className={styles.roadmapSection} id='request-access'>
                    <Card>
                        <p className={styles.badge}>Roadmap</p>
                        <h2>Up next on the platform</h2>
                        <ul className={styles.roadmapList}>
                            {roadmapHighlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <p className={styles.roadmapCta}>
                            Want to shape these tracks? Reach out at
                            roadmap@mukulasoft.com.
                        </p>
                    </Card>
                </section>
            </main>
        </LayoutShell>
    )
}
