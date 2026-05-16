import type { Trip } from '../../types'

interface TripSectionProps {
    trips: Trip[]
    onNewTrip: () => void
}

export default function TripsSection( { trips } : TripSectionProps) {

    const lastThreeTrips = trips.filter(t => t.startDate !== null).sort((a, b) => new Date(b.startDate!).getTime() - new Date (a.startDate!).getTime()).slice(0, 3)


    return (
        <>
        {/* Last trips label */}
        <div className="" style={{
            padding: 'var(--space-5) var(--space-5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'var(--space-3)'
        }}>

            <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text-primary)',
                letterSpacing: 'var(--lh-extratight)'
            }}>Ostatnie wyjazdy <span style={{
                fontWeight: 'var(--fw-regular)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)'
            }}> {lastThreeTrips.length} z {trips.length}</span></div>

            <button style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                background: 'transparent',
                border: 'none'
            }}>Wszystkie →</button>
        </div>


        </>
    )
}
