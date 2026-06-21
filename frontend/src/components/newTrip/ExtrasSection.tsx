import { useRef, useState } from 'react'
import { NPIcon } from './icons'

interface ExtrasSectionProps {
  notes: string[]
  attachments: { name: string }[]
  onAddNote: (text: string) => void
  onRemoveNote: (index: number) => void
  onAddFiles: (files: FileList) => void
  onRemoveAttachment: (index: number) => void
}

export default function ExtrasSection({
  notes, attachments, onAddNote, onRemoveNote, onAddFiles, onRemoveAttachment,
}: ExtrasSectionProps) {
  const [noteText, setNoteText] = useState('')
  const [adding, setAdding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const submitNote = () => {
    const t = noteText.trim()
    if (!t) return
    onAddNote(t)
    setNoteText('')
    setAdding(false)
  }

  return (
    <div className="extras">
      {(notes.length > 0 || attachments.length > 0) && (
        <div className="extras__chips">
          {notes.map((n, i) => (
            <span key={'n' + i} className="extras__chip">
              <NPIcon.note />
              <span className="extras__chip-txt">{n}</span>
              <button type="button" className="extras__chip-x" onClick={() => onRemoveNote(i)} aria-label="Usuń notatkę"><NPIcon.close /></button>
            </span>
          ))}
          {attachments.map((a, i) => (
            <span key={'a' + i} className="extras__chip extras__chip--file">
              <NPIcon.clip />
              <span className="extras__chip-txt">{a.name}</span>
              <button type="button" className="extras__chip-x" onClick={() => onRemoveAttachment(i)} aria-label="Usuń załącznik"><NPIcon.close /></button>
            </span>
          ))}
        </div>
      )}

      {adding && (
        <div className="extras__notebox">
          <input
            autoFocus
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitNote() }}
            placeholder="Treść notatki…"
          />
          <button type="button" className="v-btn v-btn--primary v-btn--sm" onClick={submitNote}>Dodaj</button>
        </div>
      )}

      <div className="pills">
        <button className="pill--add" type="button" onClick={() => setAdding((v) => !v)}>
          <NPIcon.note /><span>Notatka</span>
        </button>
        <button className="pill--add" type="button" onClick={() => fileRef.current?.click()}>
          <NPIcon.clip /><span>Załącznik</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => { if (e.target.files) onAddFiles(e.target.files); e.target.value = '' }}
        />
      </div>
    </div>
  )
}
