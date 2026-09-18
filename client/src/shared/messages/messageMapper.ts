import type { ContactMessage } from '../MessagesContext/MessagesContext'
import type { ContactMessageInfoDto } from '../../api/messagesApi'

// `data`/`raspunsData` stay as raw ISO strings — MessagesSection.tsx formats them
// locale-aware with time-of-day via its own `formatDate`, unlike the date-only
// display used for reviews/scenario history.
export function toContactMessage(dto: ContactMessageInfoDto): ContactMessage {
    return {
        id: String(dto.id),
        nume: dto.name,
        email: dto.email,
        mesaj: dto.message,
        data: dto.createdAt,
        citit: dto.isRead,
        raspuns: dto.reply ?? undefined,
        raspunsData: dto.replyDate ?? undefined,
    }
}
