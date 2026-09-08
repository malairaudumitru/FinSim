import { useEffect, useRef, useState } from 'react'
import './Dropdown.css'

interface DropdownOption {
    value: string
    label: string
}

interface DropdownProps {
    value: string
    onChange: (value: string) => void
    options: DropdownOption[]
    placeholder: string
}

function Dropdown({ value, onChange, options, placeholder }: DropdownProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selected = options.find((o) => o.value === value)

    const handleSelect = (v: string) => {
        onChange(v)
        setOpen(false)
    }

    return (
        <div className="dropdown" ref={ref}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span className={selected ? '' : 'dropdown-placeholder'}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className="dropdown-arrow">▾</span>
            </button>

            {open && (
                <div className="dropdown-list">
                    {options.map((o) => (
                        <button
                            type="button"
                            key={o.value}
                            className={`dropdown-item ${o.value === value ? 'active' : ''}`}
                            onClick={() => handleSelect(o.value)}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown