import { NPIcon } from './icons'

interface NewTripAppBarProps {
  onBack: () => void
}

export default function NewTripAppBar({ onBack }: NewTripAppBarProps) {
  return (
    <header className="appbar">
      <button className="appbar__btn" aria-label="Wstecz" onClick={onBack}><NPIcon.back /></button>
      <span className="appbar__title">Nowa podróż</span>
      <button className="appbar__btn" aria-label="Więcej"><NPIcon.more /></button>
    </header>
  )
}
