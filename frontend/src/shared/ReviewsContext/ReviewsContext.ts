import { createContext, useContext } from 'react'

export interface Review {
    id: string
    autor: string
    email: string
    data: string
    rating: number
    mesaj: string
}

export const initialReviews: Review[] = [
    {
        id: 'r1',
        autor: 'Alexandru, 19 ani',
        email: 'seed1@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 5,
        mesaj: 'Prima dată când am înțeles de ce nu-mi ajungeau banii până la finalul lunii.',
    },
    {
        id: 'r2',
        autor: 'Diana, 22 ani',
        email: 'seed2@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 5,
        mesaj: 'Scenariul cu creditul m-a făcut să calculez de două ori înainte să iau unul real.',
    },
    {
        id: 'r3',
        autor: 'Mihai, 17 ani',
        email: 'seed3@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 4,
        mesaj: 'E ca un joc, dar chiar am învățat ce înseamnă fond de urgență.',
    },
    {
        id: 'r4',
        autor: 'Cristina, 20 ani',
        email: 'seed4@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 5,
        mesaj: 'Mi-a fost util mai ales scenariul cu chiria — nu credeam că facturile se adună atât de repede.',
    },
    {
        id: 'r5',
        autor: 'Vlad, 24 ani',
        email: 'seed5@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 4,
        mesaj: 'Mi-a schimbat felul în care mă gândesc la economii înainte să-mi iau propriul apartament.',
    },
    {
        id: 'r6',
        autor: 'Ana, 18 ani',
        email: 'seed6@finsim.md',
        data: '2026-06-01T00:00:00.000Z',
        rating: 5,
        mesaj: 'L-am recomandat colegilor de liceu — e mult mai practic decât orele de educație financiară.',
    },
]

export interface ReviewsContextValue {
    reviews: Review[]
    addReview: (review: Omit<Review, 'id'>) => void
    updateReview: (id: string, patch: Partial<Omit<Review, 'id'>>) => void
    deleteReview: (id: string) => void
}

export const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined)

export function useReviews() {
    const ctx = useContext(ReviewsContext)
    if (!ctx) {
        throw new Error('useReviews trebuie folosit în interiorul ReviewsProvider')
    }
    return ctx
}