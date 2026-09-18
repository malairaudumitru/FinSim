import { createContext, useContext } from 'react'

export interface Review {
    id: string
    autor: string
    email: string
    data: string
    rating: number
    mesaj: string
}

export interface ReviewInput {
    nume: string
    varsta: number
    email: string
    rating: number
    mesaj: string
}

export interface ReviewsContextValue {
    reviews: Review[]
    loading: boolean
    addReview: (input: ReviewInput) => Promise<void>
    updateReview: (id: string, input: ReviewInput) => Promise<void>
    deleteReview: (id: string) => Promise<void>
    refresh: () => Promise<void>
}

export const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined)

export function useReviews() {
    const ctx = useContext(ReviewsContext)
    if (!ctx) {
        throw new Error('useReviews trebuie folosit în interiorul ReviewsProvider')
    }
    return ctx
}
