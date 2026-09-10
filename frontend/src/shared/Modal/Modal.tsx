import { useEffect, type ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
    title: string
    onClose: () => void
    children: ReactNode
}

function Modal({ title, onClose, children }: ModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button type="button" className="modal-close" onClick={onClose} aria-label="Închide">
                        ✕
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}

export default Modal
