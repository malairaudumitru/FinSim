import { createContext, useContext } from 'react'

export interface VideoResource {
    id: string
    youtubeId: string
    titlu: string
    titluRo: string
    titluEn: string
    titluRu: string
    sursa: string
    tema: string
}

export interface PdfResource {
    id: string
    titlu: string
    descriere: string
    titluRo: string
    titluEn: string
    titluRu: string
    descriereRo: string
    descriereEn: string
    descriereRu: string
    fisier: string
    tema: string
}

export interface ResourcesContextValue {
    videos: VideoResource[]
    pdfs: PdfResource[]
    loading: boolean
    addVideo: (video: Omit<VideoResource, 'id'>) => Promise<void>
    updateVideo: (id: string, patch: Omit<VideoResource, 'id'>) => Promise<void>
    deleteVideo: (id: string) => Promise<void>
    addPdf: (pdf: Omit<PdfResource, 'id'>) => Promise<void>
    updatePdf: (id: string, patch: Omit<PdfResource, 'id'>) => Promise<void>
    deletePdf: (id: string) => Promise<void>
    refresh: () => Promise<void>
}

export const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined)

export function useResources() {
    const ctx = useContext(ResourcesContext)
    if (!ctx) {
        throw new Error('useResources trebuie folosit în interiorul ResourcesProvider')
    }
    return ctx
}
