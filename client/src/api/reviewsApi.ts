import { api } from './api'

export interface ReviewInfoDto {
    id: number
    name: string
    age: number
    email: string
    createdAt: string
    rating: number
    message: string
    isDeleted: boolean
}

export interface ReviewCreateDto {
    name: string
    age: number
    email: string
    rating: number
    message: string
}

export function getReviewList(): Promise<ReviewInfoDto[]> {
    return api.get<ReviewInfoDto[]>('/reviews/list')
}

export function createReview(data: ReviewCreateDto): Promise<string> {
    return api.post<string>('/reviews/create', data)
}

export function updateReview(id: number, data: ReviewCreateDto): Promise<string> {
    return api.put<string>(`/reviews/update/${id}`, data)
}

export function deleteReview(id: number): Promise<string> {
    return api.delete<string>(`/reviews/${id}`)
}
