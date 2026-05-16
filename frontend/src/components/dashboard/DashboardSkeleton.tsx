export default function DashboardSkeleton() {
    return (
        <>
            {/* TopBar */}
            <header className="topbar">
                <div className="topbar__logo">
                    <div className="sk sk--sand" style={{ width: 20, height: 20, borderRadius: 4 }} />
                    <div className="sk sk--sand" style={{ width: 80, height: 12, borderRadius: 4 }} />
                </div>
                <div className="sk sk--sand" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            </header>

            {/* Greeting */}
            <div className="v-card" style={{ background: 'transparent', border: 'none', paddingLeft: 'var(--space-5)', gap: 'var(--space-2)' }}>
                <div className="sk sk--sand" style={{ width: 160, height: 12, borderRadius: 4 }} />
                <div className="sk sk--sand" style={{ width: 220, height: 28, borderRadius: 6, marginTop: 4 }} />
            </div>

            {/* Green summary card */}
            <div className="v-card" style={{
                background: 'linear-gradient(160deg, var(--moss-600), var(--moss-800))',
                margin: 'var(--space-1) var(--space-5) var(--space-4)',
                padding: 'var(--space-4)',
                display: 'flex',
                gap: 'var(--space-5)'
            }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div className="sk sk--white" style={{ width: 120, height: 10, borderRadius: 4 }} />
                    <div className="sk sk--white" style={{ width: 160, height: 36, borderRadius: 6 }} />
                    <div className="sk sk--white" style={{ width: 100, height: 10, borderRadius: 4 }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div className="sk sk--white" style={{ width: 90, height: 24, borderRadius: 999 }} />
                    <div className="sk sk--white" style={{ width: 75, height: 24, borderRadius: 999 }} />
                </div>
            </div>

            {/* Act cards */}
            <div className="twin-wrapper" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="sk" style={{ height: 152, borderRadius: 18, background: 'var(--sand-200)' }} />
                <div className="sk" style={{ height: 152, borderRadius: 18, background: 'var(--sand-200)', animationDelay: '0.1s' }} />
            </div>

            {/* Quick-action buttons */}
            <div className="twin-wrapper">
                <div className="v-card sk sk--sand" style={{ height: 52, borderRadius: 'var(--radius-lg)' }} />
                <div className="v-card sk sk--sand" style={{ height: 52, borderRadius: 'var(--radius-lg)', animationDelay: '0.1s' }} />
            </div>
        </>
    )
}
