import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000

export function useRateLimit() {
    const [isLimited, setIsLimited] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const attemptTimestamps = useRef<number[]>([])
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const startCountdown = useCallback((unblockAt: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current)

        const tick = () => {
            const remaining = Math.max(0, Math.ceil((unblockAt - Date.now()) / 1000))
            setSecondsLeft(remaining)
            if (remaining <= 0) {
                setIsLimited(false)
                attemptTimestamps.current = []
                if (intervalRef.current) clearInterval(intervalRef.current)
            }
        }

        tick()
        intervalRef.current = setInterval(tick, 1000)
    }, [])

    /** Înregistrează o încercare; returnează false dacă tocmai s-a depășit limita. */
    const registerAttempt = useCallback((): boolean => {
        const now = Date.now()
        attemptTimestamps.current = attemptTimestamps.current.filter((t) => now - t < WINDOW_MS)
        attemptTimestamps.current.push(now)

        if (attemptTimestamps.current.length > MAX_ATTEMPTS) {
            const oldest = attemptTimestamps.current[0]
            setIsLimited(true)
            startCountdown(oldest + WINDOW_MS)
            return false
        }

        return true
    }, [startCountdown])

    return { isLimited, secondsLeft, registerAttempt }
}
