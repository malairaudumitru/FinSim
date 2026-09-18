import { useEffect, useState, type ReactNode } from 'react'
import { ReviewsContext, type Review, type ReviewInput } from './ReviewsContext.ts'
import * as reviewsApi from '../../api/reviewsApi'
import { toReview, toReviewCreateDto } from '../reviews/reviewMapper'

export function ReviewsProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        reviewsApi
            .getReviewList()
            .then((list) => setReviews(list.map(toReview)))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false))
    }, [])

    const addReview = async (input: ReviewInput) => {
        await reviewsApi.createReview(toReviewCreateDto(input))
        const list = await reviewsApi.getReviewList()
        setReviews(list.map(toReview))
    }

    const updateReview = async (id: string, input: ReviewInput) => {
        await reviewsApi.updateReview(Number(id), toReviewCreateDto(input))
        const list = await reviewsApi.getReviewList()
        setReviews(list.map(toReview))
    }

    const deleteReview = async (id: string) => {
        await reviewsApi.deleteReview(Number(id))
        setReviews((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <ReviewsContext.Provider value={{ reviews, loading, addReview, updateReview, deleteReview }}>
            {children}
        </ReviewsContext.Provider>
    )
}
