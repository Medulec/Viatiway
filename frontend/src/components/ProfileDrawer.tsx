import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ProfileDrawerProps {
  open: boolean
  onClose: () => void
}

function getUser() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { name: payload.name as string, email: payload.email as string }
  } catch {
    return null
  }
}

function Initials({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-full)',
      background: 'linear-gradient(135deg, var(--clay-300), var(--clay-500))',
      color: 'var(--sand-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--fw-semibold)',
      fontFamily: 'var(--font-sans)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26, 24, 18, 0.4)',
          zIndex: 'var(--z-overlay)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur-base) var(--ease-out)',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-drawer)',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
          padding: 'var(--space-4)',
          paddingBottom: 'calc(var(--bottombar-height) + var(--space-4))',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--dur-base) var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="t-overline">Konto</span>
          <button className="v-btn v-btn--ghost v-btn--icon v-btn--sm" onClick={onClose} aria-label="Zamknij">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Initials name={user.name} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              <span className="t-h4">{user.name}</span>
              <span className="t-caption">{user.email}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DrawerOption
            icon={<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2.5a1.5 1.5 0 0 1 2.12 2.12L5.5 14.25 2 15l.75-3.5L13 2.5z" />
            </svg>}
            label="Edytuj profil"
            onClick={onClose}
          />
          <DrawerOption
            icon={<svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4" />
              <polyline points="12 13 16 9 12 5" />
              <line x1="16" y1="9" x2="6" y2="9" />
            </svg>}
            label="Wyloguj"
            onClick={handleLogout}
            danger
          />
        </div>
      </div>
    </>
  )
}

function DrawerOption({ icon, label, onClick, danger }: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        background: 'none',
        border: 'none',
        padding: 'var(--space-2) var(--space-1)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: danger ? 'var(--danger)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-regular)',
        width: '100%',
        textAlign: 'left',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
