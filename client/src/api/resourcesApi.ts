import { api } from './api'

export const ResourceTheme = {
    General: 0,
    Budget: 1,
    Savings: 2,
    FinancialDecisions: 3,
    Credit: 4,
} as const
export type ResourceTheme = (typeof ResourceTheme)[keyof typeof ResourceTheme]

export interface VideoResourceInfoDto {
    id: number
    youtubeId: string
    title: string
    source: string
    theme: ResourceTheme
    isDeleted: boolean
}

export interface VideoResourceCreateDto {
    youtubeId: string
    title: string
    source: string
    theme: ResourceTheme
}

export interface PdfResourceInfoDto {
    id: number
    title: string
    description: string
    filePath: string
    theme: ResourceTheme
    isDeleted: boolean
}

export interface PdfResourceCreateDto {
    title: string
    description: string
    filePath: string
    theme: ResourceTheme
}

export function getVideoList(): Promise<VideoResourceInfoDto[]> {
    return api.get<VideoResourceInfoDto[]>('/resources/videos')
}

export function createVideo(data: VideoResourceCreateDto): Promise<string> {
    return api.post<string>('/resources/videos/create', data)
}

export function updateVideo(id: number, data: VideoResourceCreateDto): Promise<string> {
    return api.put<string>(`/resources/videos/update/${id}`, data)
}

export function deleteVideo(id: number): Promise<string> {
    return api.delete<string>(`/resources/videos/${id}`)
}

export function getPdfList(): Promise<PdfResourceInfoDto[]> {
    return api.get<PdfResourceInfoDto[]>('/resources/pdfs')
}

export function createPdf(data: PdfResourceCreateDto): Promise<string> {
    return api.post<string>('/resources/pdfs/create', data)
}

export function updatePdf(id: number, data: PdfResourceCreateDto): Promise<string> {
    return api.put<string>(`/resources/pdfs/update/${id}`, data)
}

export function deletePdf(id: number): Promise<string> {
    return api.delete<string>(`/resources/pdfs/${id}`)
}

export function uploadPdf(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    return api.uploadFile<{ url: string }>('/resources/pdfs/upload', formData)
}
