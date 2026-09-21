import type { NotificationItem, NotificationType } from '../NotificationsContext/NotificationsContext'
import { NotificationType as ApiNotificationType, type NotificationInfoDto } from '../../api/notificationsApi'

const TYPE_TO_LABEL: Record<number, NotificationType> = {
    [ApiNotificationType.Scenario]: 'scenariu',
    [ApiNotificationType.Account]: 'cont',
    [ApiNotificationType.System]: 'sistem',
}

const LABEL_TO_TYPE: Record<NotificationType, ApiNotificationType> = {
    scenariu: ApiNotificationType.Scenario,
    cont: ApiNotificationType.Account,
    sistem: ApiNotificationType.System,
}

export function toType(tip: NotificationType): ApiNotificationType {
    return LABEL_TO_TYPE[tip]
}

function formatDate(isoDate: string): string {
    const d = new Date(isoDate)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export function toNotificationItem(dto: NotificationInfoDto, email: string): NotificationItem {
    return {
        id: String(dto.id),
        tip: TYPE_TO_LABEL[dto.type] ?? 'sistem',
        mesaj: dto.message,
        mesajRo: dto.messageRo,
        mesajEn: dto.messageEn ?? '',
        mesajRu: dto.messageRu ?? '',
        data: formatDate(dto.createdAt),
        citit: dto.isRead,
        email,
        contactMessageId: dto.contactMessageId ?? undefined,
    }
}
