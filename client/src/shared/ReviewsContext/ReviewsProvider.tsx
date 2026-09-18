import { useEffect, useState, type ReactNode } from 'react'
import { ReviewsContext, type Review, type ReviewInput } from './ReviewsContext.ts'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportingCall } from '../reportServerError'
import * as reviewsApi from '../../api/reviewsApi'
import { toReview, toReviewCreateDto } from '../reviews/reviewMapper'

export function ReviewsProvider({ children }: { children: ReactNode }) {
    const { showError } = useErrorModal()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        try {
            const list = await reviewsApi.getReviewList()
            setReviews(list.map(toReview))
        } catch {
            setReviews([])
        }
    }

    // Background load only feeds the public HomePage showcase — degrades silently,
    // no global modal (landing/informational content, per product decision).
    useEffect(() => {
        reviewsApi
            .getReviewList()
            .then((list) => setReviews(list.map(toReview)))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false))
    }, [])

    const addReview = async (input: ReviewInput) => {
        await reportingCall(reviewsApi.createReview(toReviewCreateDto(input)), showError)
        const list = await reviewsApi.getReviewList()
        setReviews(list.map(toReview))
    }

    const updateReview = async (id: string, input: ReviewInput) => {
        await reportingCall(reviewsApi.updateReview(Number(id), toReviewCreateDto(input)), showError)
        const list = await reviewsApi.getReviewList()
        setReviews(list.map(toReview))
    }

    const deleteReview = async (id: string) => {
        await reportingCall(reviewsApi.deleteReview(Number(id)), showError)
        setReviews((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <ReviewsContext.Provider value={{ reviews, loading, addReview, updateReview, deleteReview, refresh }}>
            {children}
        </ReviewsContext.Provider>
    )
}
