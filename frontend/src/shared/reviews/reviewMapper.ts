import type { Review, ReviewInput } from '../ReviewsContext/ReviewsContext'
import type { ReviewCreateDto, ReviewInfoDto } from '../../api/reviewsApi'

export function toReview(dto: ReviewInfoDto): Review {
    return {
        id: String(dto.id),
        autor: dto.age ? `${dto.name}, ${dto.age} ani` : dto.name,
        email: dto.email,
        data: dto.createdAt,
        rating: dto.rating,
        mesaj: dto.message,
    }
}

export function toReviewCreateDto(input: ReviewInput): ReviewCreateDto {
    return {
        name: input.nume,
        age: input.varsta,
        email: input.email,
        rating: input.rating,
        message: input.mesaj,
    }
}
