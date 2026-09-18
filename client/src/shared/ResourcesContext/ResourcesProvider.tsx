import { useEffect, useState, type ReactNode } from 'react'
import {
    ResourcesContext,
    type VideoResource,
    type PdfResource,
} from './ResourcesContext.ts'
import { useErrorModal } from '../ErrorModalContext/ErrorModalContext'
import { reportIfServerError, reportingCall } from '../reportServerError'
import * as resourcesApi from '../../api/resourcesApi'
import { toPdfCreateDto, toPdfResource, toVideoCreateDto, toVideoResource } from '../resources/resourceMapper'

export function ResourcesProvider({ children }: { children: ReactNode }) {
    const { showError } = useErrorModal()
    const [videos, setVideos] = useState<VideoResource[]>([])
    const [pdfs, setPdfs] = useState<PdfResource[]>([])
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        try {
            const [videoList, pdfList] = await Promise.all([resourcesApi.getVideoList(), resourcesApi.getPdfList()])
            setVideos(videoList.map(toVideoResource))
            setPdfs(pdfList.map(toPdfResource))
        } catch (err) {
            reportIfServerError(err, showError)
            setVideos([])
            setPdfs([])
        }
    }

    useEffect(() => {
        Promise.all([resourcesApi.getVideoList(), resourcesApi.getPdfList()])
            .then(([videoList, pdfList]) => {
                setVideos(videoList.map(toVideoResource))
                setPdfs(pdfList.map(toPdfResource))
            })
            .catch((err) => {
                reportIfServerError(err, showError)
                setVideos([])
                setPdfs([])
            })
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addVideo = async (video: Omit<VideoResource, 'id'>) => {
        await reportingCall(resourcesApi.createVideo(toVideoCreateDto(video)), showError)
        const list = await resourcesApi.getVideoList()
        setVideos(list.map(toVideoResource))
    }

    const updateVideo = async (id: string, patch: Omit<VideoResource, 'id'>) => {
        await reportingCall(resourcesApi.updateVideo(Number(id), toVideoCreateDto(patch)), showError)
        const list = await resourcesApi.getVideoList()
        setVideos(list.map(toVideoResource))
    }

    const deleteVideo = async (id: string) => {
        await reportingCall(resourcesApi.deleteVideo(Number(id)), showError)
        setVideos((prev) => prev.filter((v) => v.id !== id))
    }

    const addPdf = async (pdf: Omit<PdfResource, 'id'>) => {
        await reportingCall(resourcesApi.createPdf(toPdfCreateDto(pdf)), showError)
        const list = await resourcesApi.getPdfList()
        setPdfs(list.map(toPdfResource))
    }

    const updatePdf = async (id: string, patch: Omit<PdfResource, 'id'>) => {
        await reportingCall(resourcesApi.updatePdf(Number(id), toPdfCreateDto(patch)), showError)
        const list = await resourcesApi.getPdfList()
        setPdfs(list.map(toPdfResource))
    }

    const deletePdf = async (id: string) => {
        await reportingCall(resourcesApi.deletePdf(Number(id)), showError)
        setPdfs((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <ResourcesContext.Provider
            value={{ videos, pdfs, loading, addVideo, updateVideo, deleteVideo, addPdf, updatePdf, deletePdf, refresh }}
        >
            {children}
        </ResourcesContext.Provider>
    )
}
