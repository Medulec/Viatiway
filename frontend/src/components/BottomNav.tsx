import { useNavigate, useLocation } from 'react-router-dom'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import WorkRoundedIcon from '@mui/icons-material/WorkRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

const NAV_ITEMS = [
  { label: 'Pulpit',    path: '/',          icon: HomeRoundedIcon },
  { label: 'Delegacje', path: '/delegacje', icon: WorkRoundedIcon },
  { label: 'Pojazdy',   path: '/pojazdy',   icon: DirectionsCarRoundedIcon },
]

interface BottomNavProps {
  onProfileClick: () => void
}

export default function BottomNav({ onProfileClick }: BottomNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const profileActive = pathname === '/profil'

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--bottombar-height)',
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      zIndex: 'var(--z-sticky)',
    }}>
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const active = pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? 'var(--moss-500)' : 'var(--sand-400)',
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
          >
            <Icon style={{ fontSize: 24 }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-sans)',
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-regular)',
            }}>
              {label}
            </span>
          </button>
        )
      })}
      <button
        onClick={onProfileClick}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: profileActive ? 'var(--moss-500)' : 'var(--sand-400)',
          transition: 'color var(--dur-fast) var(--ease-out)',
        }}
      >
        <PersonRoundedIcon style={{ fontSize: 24 }} />
        <span style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-sans)',
          fontWeight: profileActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        }}>
          Profil
        </span>
      </button>
    </nav>
  )
}
