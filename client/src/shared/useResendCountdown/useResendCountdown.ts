import { useCallback, useEffect, useRef, useState } from 'react'

const RESEND_COOLDOWN_SECONDS = 120

export function useResendCountdown(seconds: number = RESEND_COOLDOWN_SECONDS) {
    const [secondsLeft, setSecondsLeft] = useState(seconds)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const clear = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    const restart = useCallback(() => {
        clear()
        setSecondsLeft(seconds)
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clear()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [seconds, clear])

    useEffect(() => clear, [clear])

    return { secondsLeft, canResend: secondsLeft === 0, restart }
}
