import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
    value: string
    durationMs?: number
}

function AnimatedNumber({ value, durationMs = 1200 }: AnimatedNumberProps) {
    const match = value.match(/^(\D*)([\d\s]+)(\D*)$/)
    const parsedTarget = match ? parseInt(match[2].replace(/\s/g, ''), 10) : NaN
    const canAnimate = match !== null && !Number.isNaN(parsedTarget)

    const prefix = match?.[1] ?? ''
    const suffix = match?.[3] ?? ''

    const [display, setDisplay] = useState(canAnimate ? `${prefix}0${suffix}` : value)
    const ref = useRef<HTMLSpanElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (!canAnimate) return


        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    const start = performance.now()

                    const step = (now: number) => {
                        const progress = Math.min((now - start) / durationMs, 1)
                        const eased = 1 - Math.pow(1 - progress, 3)
                        const current = Math.round(parsedTarget * eased)
                        setDisplay(`${prefix}${current}${suffix}`)
                        if (progress < 1) {
                            requestAnimationFrame(step)
                        } else {
                            setDisplay(value)
                        }
                    }

                    requestAnimationFrame(step)
                    observer.disconnect()
                }
            },
            { threshold: 0.4 }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [canAnimate, durationMs, parsedTarget, prefix, suffix, value])

    return (
        <span className="figure" ref={ref}>
            {display}
        </span>
    )
}

export default AnimatedNumber