import { useTranslation } from 'react-i18next'
import './StarRating.css'

interface StarRatingProps {
    rating: number
    onChange?: (rating: number) => void
    size?: number
}

function StarRating({ rating, onChange, size = 18 }: StarRatingProps) {
    const { t } = useTranslation()
    const interactive = Boolean(onChange)

    return (
        <div className={`star-rating ${interactive ? 'interactive' : ''}`} style={{ fontSize: size }}>
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    type="button"
                    key={n}
                    className={`star ${n <= rating ? 'filled' : ''}`}
                    onClick={interactive ? () => onChange?.(n) : undefined}
                    disabled={!interactive}
                    aria-label={t('starRating.ariaTemplate', { n })}
                >
                    ★
                </button>
            ))}
        </div>
    )
}

export default StarRating