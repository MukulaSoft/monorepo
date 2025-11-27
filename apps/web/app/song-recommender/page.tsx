import { LayoutShell, Card } from '@mukulasoft/ui'
import { RecommenderClient } from '../../components/RecommenderClient'
import styles from './styles/page.module.css'
import { RecommenderNavigation } from '../../components/RecommenderNavigation'

export default function HomePage() {
    return (
        <LayoutShell>
            <RecommenderNavigation />
            <Card className={styles.introCard}>
                <h1 className={styles.introTitle}>Song Recommender</h1>
                <p className={styles.introDescription}>
                    Curious what you should listen to next? Search our catalog
                    and we&apos;ll assemble a complementary queue using our
                    similarity model plus your tastes.
                </p>
            </Card>
            <RecommenderClient />
        </LayoutShell>
    )
}
