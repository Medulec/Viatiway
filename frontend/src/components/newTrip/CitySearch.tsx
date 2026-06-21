import { useEffect, useRef, useState } from 'react'
import { searchPlaces, type Place } from '../../lib/geocode'

interface CitySearchProps {
  value: string
  placeholder?: string
  inputClassName?: string
  onText: (text: string) => void
  onPick: (place: Place) => void
}

export default function CitySearch({ value, placeholder, inputClassName, onText, onPick }: CitySearchProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const skipRef = useRef(false)

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false
      return
    }
    const q = value.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const timer = setTimeout(() => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl
      setLoading(true)
      searchPlaces(q, ctrl.signal)
        .then((places) => {
          setSuggestions(places)
          setOpen(places.length > 0)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 350)
    return () => clearTimeout(timer)
  }, [value])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pick = (place: Place) => {
    skipRef.current = true
    onPick(place)
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div className="citysearch" ref={wrapRef}>
      <input
        className={inputClassName}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onText(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul className="citysearch__list">
          {loading && <li className="citysearch__hint">Szukam…</li>}
          {suggestions.map((p) => (
            <li key={`${p.lat},${p.lon}`}>
              <button type="button" className="citysearch__item" onClick={() => pick(p)}>
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
