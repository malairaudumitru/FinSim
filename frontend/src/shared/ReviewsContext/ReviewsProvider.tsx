import { useState, type ReactNode } from 'react'
import { ReviewsContext, initialReviews, type Review } from './ReviewsContext'

export function ReviewsProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)

    const addReview = (review: Omit<Review, 'id'>) => {
        setReviews((prev) => [{ ...review, id: `r${Date.now()}` }, ...prev])
    }

    const updateReview = (id: string, patch: Partial<Omit<Review, 'id'>>) => {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }

    const deleteReview = (id: string) => {
        setReviews((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
            {children}
        </ReviewsContext.Provider>
    )
}
