import { useState, type ReactNode } from 'react'
import { ReviewsContext, initialReviews, type Review } from './ReviewsContext'

export function ReviewsProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)

    const addReview = (review: Omit<Review, 'id'>) => {
        setReviews((prev) => [{ ...review, id: `r${Date.now()}` }, ...prev])
    }

    return (
        <ReviewsContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewsContext.Provider>
    )
}