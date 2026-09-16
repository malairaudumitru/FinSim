import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    searchable?: boolean
    searchPlaceholder?: string
}

function Dropdown({ value, onChange, options, placeholder, searchable = false, searchPlaceholder }: DropdownProps) {
    const { t } = useTranslation()
    const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.dropdown_search_placeholder')
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const ref = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (open && searchable) {
            setQuery('')
            searchRef.current?.focus()
        }
    }, [open, searchable])

    const selected = options.find((o) => o.value === value)

    const handleSelect = (v: string) => {
        onChange(v)
        setOpen(false)
    }

    const filteredOptions = searchable && query.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
        : options

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
                    {searchable && (
                        <input
                            ref={searchRef}
                            type="text"
                            className="dropdown-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={resolvedSearchPlaceholder}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    {filteredOptions.length === 0 && (
                        <div className="dropdown-empty">{t('common.dropdown_no_results')}</div>
                    )}
                    {filteredOptions.map((o) => (
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