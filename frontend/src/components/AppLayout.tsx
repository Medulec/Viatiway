import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import ProfileDrawer from './ProfileDrawer'

export default function AppLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <div>
            <Outlet context={{ onProfileClick: () => setDrawerOpen(true) }} />
            <BottomNav onProfileClick={() => setDrawerOpen(true)} />
            <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </div>
    )
}