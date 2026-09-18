import './Checkbox.css'

interface CheckboxProps {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
}

function Checkbox({ id, checked, onChange, label }: CheckboxProps) {
    return (
        <label className="custom-checkbox" htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span>{label}</span>
        </label>
    )
}

export default Checkbox
