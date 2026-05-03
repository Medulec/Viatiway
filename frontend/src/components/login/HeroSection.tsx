import '../../styles/tokens.css'
import '../../styles/components.css'

export default function HeroSection() {
    return (
        <div style={{
            background: 'linear-gradient(160deg, var(--moss-700), var(--moss-500))',
            padding: 'var(--space-8) var(--space-6) var(--space-16)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', inset: '0', opacity: 0.08,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px',
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
            }} />

            <div style={{
                display: 'flex', alignItems: 'center',
                gap: 'var(--space-2)', marginBottom: 'var(--space-8)',
                position: 'relative',
            }}>
                {/* Placeholder for logo, in progress*/}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5l9 13L21 5"
                        stroke="white" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                    />
                </svg>
                <span className="t-h4" style={{ color: 'var(--sand-50)' }}>VIATIWAY</span>
            </div>

            <h2 className="t-h1" style={{
                color: 'var(--sand-50)',
                margin: '0 0 var(--space-3)',
                position: 'relative',
                textAlign: 'left',
                fontWeight: 'var(--fw-bold)',
            }}>
                Twoja droga <br />
                do <span style={{
                    color: 'var(--clay-400)',
                    fontWeight: 'var(--fw-bold)',
                }}>rozliczonych <br /></span>
                delegacji.
            </h2>

            <p className="t-caption" style={{
                color: 'var(--moss-50)',
                textAlign: 'left',
                position: 'relative',
                opacity: 0.65
            }}>
                Zaloguj się i wprowadź pierwsze koszty <br />w mniej niż minutę (liczyliśmy).
            </p>
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'wave-flow 24s linear infinite' }}
                viewBox="0 0 1440 90" preserveAspectRatio="none">
                <path d="M0,45 C240,0 480,90 720,45 C960,0 1200,90 1440,45 L1440,90 L0,90 Z" fill="var(--moss-800)" />
            </svg>

            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'wave-flow 24s linear infinite' }}
                viewBox="0 0 1440 90" preserveAspectRatio="none">
                <path d="M0,45 C240,0 480,90 720,45 C960,0 1200,90 1440,45 L1440,90 L0,90 Z" fill="var(--moss-800)" />
            </svg>

            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'wave-flow 12s linear -3s infinite' }}
                viewBox="0 0 1440 90" preserveAspectRatio="none">
                <path d="M0,45 C240,0 480,90 720,45 C960,0 1200,90 1440,45 L1440,90 L0,90 Z" fill="var(--moss-600)" />
            </svg>

            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '90px', animation: 'wave-flow 8s linear -1.5s infinite' }}
                viewBox="0 0 1440 90" preserveAspectRatio="none">
                <path d="M0,45 C240,0 480,90 720,45 C960,0 1200,90 1440,45 L1440,90 L0,90 Z" fill="var(--moss-400)" />
            </svg>

        </div>
    )
}
