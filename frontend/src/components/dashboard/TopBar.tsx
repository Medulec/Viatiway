import type { User } from '../../types'

interface TopBarProps {
    user: User | null
}

export default function TopBar({ user }: TopBarProps) {

    const initials = user?.name ? user.name
    .split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : '??'

    return (
        <header className="topbar">

            <div className="topbar__logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5l9 13L21 5"
                        stroke="var(--moss-800)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span className="v-brand">VIATIWAY</span>
            </div>
            <button className="topbar__avatar">{initials}</button>
        </header>
    )
}
