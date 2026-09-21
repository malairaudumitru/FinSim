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

const LIST_MAX_HEIGHT = 220
const ITEM_HEIGHT = 40
const SEARCH_HEIGHT = 44
const LIST_GAP = 6

/** Nearest ancestor that scrolls (e.g. the modal body), so the list is measured against what is visible. */
function findScrollParent(element: HTMLElement | null): HTMLElement | null {
    let node = element?.parentElement ?? null
    while (node) {
        const overflowY = getComputedStyle(node).overflowY
        if (overflowY === 'auto' || overflowY === 'scroll') return node
        node = node.parentElement
    }
    return null
}

function Dropdown({ value, onChange, options, placeholder, searchable = false, searchPlaceholder }: DropdownProps) {
    const { t } = useTranslation()
    const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.dropdown_search_placeholder')
    const [open, setOpen] = useState(false)
    const [dropUp, setDropUp] = useState(false)
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
            searchRef.current?.focus()
        }
    }, [open, searchable])

    const selected = options.find((o) => o.value === value)

    // Open upwards when the list does not fit below the trigger (e.g. near the bottom of a modal)
    // and there is more room above it.
    const shouldOpenUp = () => {
        const root = ref.current
        if (!root) return false
        const trigger = root.getBoundingClientRect()
        const scroller = findScrollParent(root)?.getBoundingClientRect()
        const listHeight =
            Math.min(LIST_MAX_HEIGHT, 12 + (searchable ? SEARCH_HEIGHT : 0) + options.length * ITEM_HEIGHT) + LIST_GAP
        const spaceBelow = Math.min(scroller?.bottom ?? window.innerHeight, window.innerHeight) - trigger.bottom
        const spaceAbove = trigger.top - Math.max(scroller?.top ?? 0, 0)
        return spaceBelow < listHeight && spaceAbove > spaceBelow
    }

    const toggleOpen = () => {
        if (!open) {
            setQuery('')
            setDropUp(shouldOpenUp())
        }
        setOpen(!open)
    }

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
                onClick={toggleOpen}
                aria-expanded={open}
            >
                <span className={selected ? '' : 'dropdown-placeholder'}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className="dropdown-arrow">▾</span>
            </button>

            {open && (
                <div className={`dropdown-list ${dropUp ? 'drop-up' : ''}`}>
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