import type { VideoResource, PdfResource } from '../ResourcesContext/ResourcesContext'
import {
    ResourceTheme,
    type PdfResourceCreateDto,
    type PdfResourceInfoDto,
    type VideoResourceCreateDto,
    type VideoResourceInfoDto,
} from '../../api/resourcesApi'

const THEME_TO_LABEL: Record<ResourceTheme, string> = {
    [ResourceTheme.General]: 'General',
    [ResourceTheme.Budget]: 'Buget',
    [ResourceTheme.Savings]: 'Economii',
    [ResourceTheme.FinancialDecisions]: 'Decizii financiare',
    [ResourceTheme.Credit]: 'Credite',
}

const LABEL_TO_THEME: Record<string, ResourceTheme> = {
    General: ResourceTheme.General,
    Buget: ResourceTheme.Budget,
    Economii: ResourceTheme.Savings,
    'Decizii financiare': ResourceTheme.FinancialDecisions,
    Credite: ResourceTheme.Credit,
}

export function toVideoResource(dto: VideoResourceInfoDto): VideoResource {
    return {
        id: String(dto.id),
        youtubeId: dto.youtubeId,
        titlu: dto.title,
        titluRo: dto.titleRo,
        titluEn: dto.titleEn ?? '',
        titluRu: dto.titleRu ?? '',
        sursa: dto.source,
        tema: THEME_TO_LABEL[dto.theme] ?? 'General',
    }
}

export function toVideoCreateDto(video: Omit<VideoResource, 'id'>): VideoResourceCreateDto {
    return {
        youtubeId: video.youtubeId,
        titleRo: video.titluRo,
        titleEn: video.titluEn.trim() || null,
        titleRu: video.titluRu.trim() || null,
        source: video.sursa,
        theme: LABEL_TO_THEME[video.tema] ?? ResourceTheme.General,
    }
}

export function toPdfResource(dto: PdfResourceInfoDto): PdfResource {
    return {
        id: String(dto.id),
        titlu: dto.title,
        descriere: dto.description,
        titluRo: dto.titleRo,
        titluEn: dto.titleEn ?? '',
        titluRu: dto.titleRu ?? '',
        descriereRo: dto.descriptionRo,
        descriereEn: dto.descriptionEn ?? '',
        descriereRu: dto.descriptionRu ?? '',
        fisier: dto.filePath,
        tema: THEME_TO_LABEL[dto.theme] ?? 'General',
    }
}

export function toPdfCreateDto(pdf: Omit<PdfResource, 'id'>): PdfResourceCreateDto {
    return {
        titleRo: pdf.titluRo,
        titleEn: pdf.titluEn.trim() || null,
        titleRu: pdf.titluRu.trim() || null,
        descriptionRo: pdf.descriereRo,
        descriptionEn: pdf.descriereEn.trim() || null,
        descriptionRu: pdf.descriereRu.trim() || null,
        filePath: pdf.fisier,
        theme: LABEL_TO_THEME[pdf.tema] ?? ResourceTheme.General,
    }
}
