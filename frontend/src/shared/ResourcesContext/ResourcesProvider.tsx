import { useEffect, useState, type ReactNode } from 'react'
import {
    ResourcesContext,
    type VideoResource,
    type PdfResource,
} from './ResourcesContext.ts'
import * as resourcesApi from '../../api/resourcesApi'
import { toPdfCreateDto, toPdfResource, toVideoCreateDto, toVideoResource } from '../resources/resourceMapper'

export function ResourcesProvider({ children }: { children: ReactNode }) {
    const [videos, setVideos] = useState<VideoResource[]>([])
    const [pdfs, setPdfs] = useState<PdfResource[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([resourcesApi.getVideoList(), resourcesApi.getPdfList()])
            .then(([videoList, pdfList]) => {
                setVideos(videoList.map(toVideoResource))
                setPdfs(pdfList.map(toPdfResource))
            })
            .catch(() => {
                setVideos([])
                setPdfs([])
            })
            .finally(() => setLoading(false))
    }, [])

    const addVideo = async (video: Omit<VideoResource, 'id'>) => {
        await resourcesApi.createVideo(toVideoCreateDto(video))
        const list = await resourcesApi.getVideoList()
        setVideos(list.map(toVideoResource))
    }

    const updateVideo = async (id: string, patch: Omit<VideoResource, 'id'>) => {
        await resourcesApi.updateVideo(Number(id), toVideoCreateDto(patch))
        const list = await resourcesApi.getVideoList()
        setVideos(list.map(toVideoResource))
    }

    const deleteVideo = async (id: string) => {
        await resourcesApi.deleteVideo(Number(id))
        setVideos((prev) => prev.filter((v) => v.id !== id))
    }

    const addPdf = async (pdf: Omit<PdfResource, 'id'>) => {
        await resourcesApi.createPdf(toPdfCreateDto(pdf))
        const list = await resourcesApi.getPdfList()
        setPdfs(list.map(toPdfResource))
    }

    const updatePdf = async (id: string, patch: Omit<PdfResource, 'id'>) => {
        await resourcesApi.updatePdf(Number(id), toPdfCreateDto(patch))
        const list = await resourcesApi.getPdfList()
        setPdfs(list.map(toPdfResource))
    }

    const deletePdf = async (id: string) => {
        await resourcesApi.deletePdf(Number(id))
        setPdfs((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <ResourcesContext.Provider
            value={{ videos, pdfs, loading, addVideo, updateVideo, deleteVideo, addPdf, updatePdf, deletePdf }}
        >
            {children}
        </ResourcesContext.Provider>
    )
}
