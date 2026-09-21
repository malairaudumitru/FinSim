export type LanguageCode = 'ro' | 'en' | 'ru'

export type LanguageValues = Record<LanguageCode, string>

const LANGUAGES: { code: LanguageCode; tag: string }[] = [
    { code: 'ro', tag: 'RO' },
    { code: 'en', tag: 'EN' },
    { code: 'ru', tag: 'RU' },
]

interface LanguageFieldsProps {
    idPrefix: string
    label: string
    values: LanguageValues
    onChange: (language: LanguageCode, value: string) => void
    multiline?: boolean
}

function LanguageFields({ idPrefix, label, values, onChange, multiline = false }: LanguageFieldsProps) {
    return (
        <>
            {LANGUAGES.map(({ code, tag }) => (
                <div className="admin-field" key={code}>
                    <label htmlFor={`${idPrefix}-${code}`}>
                        {label} ({tag})
                    </label>
                    {multiline ? (
                        <textarea
                            id={`${idPrefix}-${code}`}
                            value={values[code]}
                            onChange={(e) => onChange(code, e.target.value)}
                            style={{ fontFamily: 'var(--sans)', minHeight: 80 }}
                        />
                    ) : (
                        <input
                            id={`${idPrefix}-${code}`}
                            value={values[code]}
                            onChange={(e) => onChange(code, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </>
    )
}

export default LanguageFields
