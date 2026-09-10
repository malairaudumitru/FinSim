import { createContext, useContext } from 'react'

export interface VideoResource {
    id: string
    youtubeId: string
    titlu: string
    sursa: string
    tema: string
}

export interface PdfResource {
    id: string
    titlu: string
    descriere: string
    fisier: string
    tema: string
}

export const initialVideos: VideoResource[] = [
    {
        id: 'v1',
        youtubeId: 'FtP-S4mmidQ',
        titlu: 'Care e treaba cu bugetul personal?',
        sursa: 'Școala de Bani — BCR',
        tema: 'Buget',
    },
    {
        id: 'v2',
        youtubeId: 'Ald3YHjFqSg',
        titlu: 'Care e treaba cu economisirea?',
        sursa: 'Școala de Bani — BCR',
        tema: 'Economii',
    },
    {
        id: 'v3',
        youtubeId: 'RaqH-NP2CIE',
        titlu: 'Educația financiară nu e doar despre bani, ci despre decizii',
        sursa: 'LifeLab — BCR',
        tema: 'Decizii financiare',
    },
]

export const initialPdfs: PdfResource[] = [
    {
        id: 'p1',
        titlu: 'Primul tău buget, pas cu pas',
        descriere: 'Regula 50/30/20, greșeli comune și un obicei simplu care ajută de la prima lună.',
        fisier: '/primul-buget.pdf',
        tema: 'Buget',
    },
    {
        id: 'p2',
        titlu: 'Fondul de urgență — ghid practic',
        descriere: 'Cât ar trebui să ai, cum îl construiești, și când (nu) îl folosești.',
        fisier: '/fond-de-urgenta.pdf',
        tema: 'Economii',
    },
    {
        id: 'p3',
        titlu: 'Cum citești corect un credit',
        descriere: 'DAE vs. dobândă nominală, și un checklist înainte să semnezi orice contract.',
        fisier: '/citeste-un-credit.pdf',
        tema: 'Credite',
    },
]

export interface ResourcesContextValue {
    videos: VideoResource[]
    pdfs: PdfResource[]
    addVideo: (video: Omit<VideoResource, 'id'>) => void
    updateVideo: (id: string, patch: Partial<Omit<VideoResource, 'id'>>) => void
    deleteVideo: (id: string) => void
    addPdf: (pdf: Omit<PdfResource, 'id'>) => void
    updatePdf: (id: string, patch: Partial<Omit<PdfResource, 'id'>>) => void
    deletePdf: (id: string) => void
}

export const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined)

export function useResources() {
    const ctx = useContext(ResourcesContext)
    if (!ctx) {
        throw new Error('useResources trebuie folosit în interiorul ResourcesProvider')
    }
    return ctx
}
