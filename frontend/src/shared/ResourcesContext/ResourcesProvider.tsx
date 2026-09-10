import { useState, type ReactNode } from 'react'
import {
    ResourcesContext,
    initialVideos,
    initialPdfs,
    type VideoResource,
    type PdfResource,
} from './ResourcesContext.ts'

export function ResourcesProvider({ children }: { children: ReactNode }) {
    const [videos, setVideos] = useState<VideoResource[]>(initialVideos)
    const [pdfs, setPdfs] = useState<PdfResource[]>(initialPdfs)

    const addVideo = (video: Omit<VideoResource, 'id'>) => {
        setVideos((prev) => [...prev, { ...video, id: `v${Date.now()}` }])
    }

    const updateVideo = (id: string, patch: Partial<Omit<VideoResource, 'id'>>) => {
        setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
    }

    const deleteVideo = (id: string) => {
        setVideos((prev) => prev.filter((v) => v.id !== id))
    }

    const addPdf = (pdf: Omit<PdfResource, 'id'>) => {
        setPdfs((prev) => [...prev, { ...pdf, id: `p${Date.now()}` }])
    }

    const updatePdf = (id: string, patch: Partial<Omit<PdfResource, 'id'>>) => {
        setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    }

    const deletePdf = (id: string) => {
        setPdfs((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <ResourcesContext.Provider
            value={{ videos, pdfs, addVideo, updateVideo, deleteVideo, addPdf, updatePdf, deletePdf }}
        >
            {children}
        </ResourcesContext.Provider>
    )
}
