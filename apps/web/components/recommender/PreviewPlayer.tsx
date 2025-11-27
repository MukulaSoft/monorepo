'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@mukulasoft/ui'
import styles from '../../styles/PreviewPlayer.module.css'

export function PreviewPlayer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [lockedTime, setLockedTime] = useState(0)

    const duration = useMemo(() => parseDuration(url) ?? 30, [url])

    useEffect(() => {
        const element = audioRef.current
        if (!element) return

        const handleTimeUpdate = () => {
            setProgress(element.currentTime)
            setLockedTime(element.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setProgress(0)
            setLockedTime(0)
        }

        const handleSeeking = () => {
            element.currentTime = lockedTime
        }

        element.addEventListener('timeupdate', handleTimeUpdate)
        element.addEventListener('ended', handleEnded)
        element.addEventListener('seeking', handleSeeking)
        return () => {
            element.removeEventListener('timeupdate', handleTimeUpdate)
            element.removeEventListener('ended', handleEnded)
            element.removeEventListener('seeking', handleSeeking)
        }
    }, [lockedTime, url])

    useEffect(() => {
        const element = audioRef.current
        if (!element) return
        setIsPlaying(false)
        setProgress(0)
        setLockedTime(0)
        element.pause()
        element.currentTime = 0
    }, [url])

    async function togglePlayback() {
        const element = audioRef.current
        if (!element) return
        if (isPlaying) {
            element.pause()
            setIsPlaying(false)
            return
        }
        try {
            await element.play()
            setIsPlaying(true)
        } catch (err) {
            console.error('Preview playback failed', err)
        }
    }

    const sliderValue = Math.min(progress, duration)

    return (
        <div className={styles.player}>
            <div className={styles.playerHeader}>
                <Button type='button' variant='ghost' onClick={togglePlayback}>
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <span className={styles.timestamp}>
                    {formatTimestamp(sliderValue)} / {formatTimestamp(duration)}
                </span>
            </div>
            <input
                type='range'
                min={0}
                max={duration}
                step={0.25}
                value={sliderValue}
                readOnly
                disabled
                className={styles.slider}
                aria-label='Preview progress'
            />
            <audio
                ref={audioRef}
                src={url}
                preload='none'
                controls={false}
                aria-hidden
                className={styles.hiddenAudio}
            />
        </div>
    )
}

function parseDuration(url: string) {
    try {
        const parsed = new URL(url)
        const durationParam = Number(parsed.searchParams.get('duration'))
        return Number.isFinite(durationParam) ? durationParam : null
    } catch {
        return null
    }
}

function formatTimestamp(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, '0')
    return `${minutes}:${seconds}`
}
