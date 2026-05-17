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

        <div className="v-fade-in--d4" style={{
            padding: 'var(--space-5) var(--space-5)',
            paddingBottom: 'var(--space-0)',
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

        <div className="v-list v-fade-in--d5" style={{ padding: '0 var(--space-5)' }}>
            {lastThreeTrips.map(trip => {
                const date = new Date(trip.startDate!)
                const day = date.getDate().toString().padStart(2, '0')
                const month = date.toLocaleString('pl-PL', { month: 'short' }).toUpperCase()

                return (
                    <div key={trip.id} className="v-card v-card--list">

                        <div style={{ width: 40, textAlign: 'center', padding: '5px 0', background: 'var(--moss-50)', borderRadius: 8, flexShrink: 0 }}>
                            <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--fw-bold)', color: 'var(--moss-800)', lineHeight: 1 }}>{day}</div>
                            <div style={{ fontSize: 'var(--text-3xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--moss-600)', lineHeight: 1, textTransform: 'uppercase', marginTop: 2, letterSpacing: 'var(--tracking-tight)' }}>{month}</div>
                        </div>

                        <div className="v-card__main">
                            <span className="v-card__main-title">{trip.destinationFrom} → {trip.destinationTo}</span>
                            <span className="v-card__main-meta">{trip.client}{trip.distance ? ` · ${trip.distance} km` : ''}</span>
                        </div>

                        <div className="v-card__trail" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                            <span className="v-card__trail-value">{trip.totalAmount != null ? `${trip.totalAmount} zł` : '0.00 zł'}</span>
                            <span className="v-badge v-badge--success v-badge--dot">{trip.status}</span>
                        </div>

                    </div>
                )
            })}
        </div>

        </>
    )
}
