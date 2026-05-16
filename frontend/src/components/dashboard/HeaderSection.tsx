import type { User, Trip } from '../../types'

interface HeaderProps {
    user: User | null
    trips: Trip[]
    onNewTrip: () => void
}

const DAYS_PL = ['niedziela', 'poniedziałek','wtorek','środa','czwartek','piątek','sobota']
const MONTHS_PL = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']
const MONTH_PL = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień']
const VOCATIVE: Record<string, string> = {
    'Anna': 'Anno', 'Ania': 'Aniu', 'Katarzyna': 'Katarzyno', 'Kasia': 'Kasiu',
    'Małgorzata': 'Małgorzato', 'Gosia': 'Gosiu', 'Agnieszka': 'Agnieszko',
    'Krystyna': 'Krystyno', 'Barbara': 'Barbaro', 'Basia': 'Basiu',
    'Ewa': 'Ewo', 'Zofia': 'Zofio', 'Zofia': 'Zofio', 'Zosia': 'Zosiu',
    'Monika': 'Moniko', 'Marta': 'Marto', 'Magdalena': 'Magdaleno', 'Magda': 'Magdo',
    'Joanna': 'Joanno', 'Asia': 'Asiu', 'Aleksandra': 'Aleksandro', 'Ola': 'Olu',
    'Natalia': 'Natalio', 'Karolina': 'Karolino', 'Paulina': 'Paulino',
    'Justyna': 'Justyno', 'Julia': 'Julio', 'Sylwia': 'Sylwio',
    'Piotr': 'Piotrze', 'Krzysztof': 'Krzysztofie', 'Andrzej': 'Andrzeju',
    'Tomasz': 'Tomaszu', 'Jan': 'Janie', 'Stanisław': 'Stanisławie',
    'Marek': 'Marku', 'Michał': 'Michale', 'Marcin': 'Marcinie',
    'Paweł': 'Pawle', 'Grzegorz': 'Grzegorzu', 'Łukasz': 'Łukaszu',
    'Adam': 'Adamie', 'Mateusz': 'Mateuszu', 'Jakub': 'Jakubie',
    'Kamil': 'Kamilu', 'Rafał': 'Rafale', 'Dawid': 'Dawidzie',
    'Bartosz': 'Bartoszu', 'Maciej': 'Macieju', 'Wojciech': 'Wojciechu',
    'Robert': 'Robercie', 'Szymon': 'Szymonie', 'Dariusz': 'Dariuszu', 'Admin' : 'Adminie', 'Iwona' : 'Iwono'
}

function getName( { user }: HeaderProps ) {
    const firstName = user?.name?.split(' ')[0] ?? ''
    return VOCATIVE[firstName] ?? firstName ?? 'Nieznajomy'
}


function formatDate(typeDate): string {
    const date = new Date()
    if (typeDate === 'day') {
    return `${DAYS_PL[date.getDay()]}, ${date.getDate()}. ${MONTHS_PL[date.getMonth()]}`
    }
    return `${MONTH_PL[date.getMonth()]} ${date.getFullYear()}`

}

export default function HeaderSection ({ user, trips }: HeaderProps) {

    const now = new Date()

    const total = trips
        .filter(t => t.status === 'APPROVED')
        .reduce((sum, t) => sum + (t.totalAmount ?? 0), 0)

    const drafts = trips.filter(t => t.status === 'DRAFT')

    const toAccept = trips.filter(t => t.status === 'SUBMITTED')

    const tripsThisMonth = trips.filter(t => {
        if (!t.startDate) return false
        const date = new Date(t.startDate)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    const tripsNumber = tripsThisMonth.length
    const kmTotal = tripsThisMonth.reduce((sum, t) => sum + (t.distance ?? 0), 0)



    return (
        <>
        
        {/* Greeting card */}


        <div className="v-card"
        style={{
            textAlign: 'left',
            gap: 'var(--space-1)',
            lineHeight: 'var(--lh-tight)',
            paddingTop: 'var(--space-0)',
            paddingLeft: 'var(--space-5)',
            background: 'transparent',
            border: 'none'
        }}
        >
            <h2 style={{
                marginBottom: 'var(--space-0)'
            }}>  <p className="t-caption">Dzisiaj jest, {formatDate('day')}</p>
                Cześć, <span className="t-h2" style={{color:'var(--clay-500)'}}>{getName({user})}</span>!</h2>
        </div>

        {/* Header green summary card */}

        <div className="v-card v-grain v-grain--light v-fade-in--d1"
        style={{
            background: 'linear-gradient(160deg, var(--moss-600), var(--moss-800))',
            margin: 'var(--space-1) var(--space-5) var(--space-4)',
            color: '#ffffff',
            padding: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-5)'
        }}>

            <div id="left-header-section"
            style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-0)',
                justifyContent: 'left',
                alignItems: 'left',
                textAlign: 'left'
            }}>
                <span style={{
                    fontSize: 'var(--text-3xs)',
                    fontWeight: 'var(--fw-semibold)',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'color-mix(in srgb, var(--sand-50) 75%, transparent)'

                }}>DO WYPŁATY · {formatDate()}</span>
                <span id='tripSummaryCosts' style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'var(--fw-bold)'
                }}>{total.toFixed(2)} <span>zł</span></span>
                <span style={{
                    fontSize: 'var(--text-2xs)',
                    color: 'color-mix(in srgb, var(--sand-50) 75%, transparent)'

                }}>{tripsNumber} delegacji · {kmTotal.toFixed(1)} km</span>
            </div>
            <div id="right-header-section"
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
                minWidth: 0,
                alignItems: 'flex-end',
                justifyContent: 'right'

            }}><button className="v-btn v-btn--primary" 
            style={{ 
                height: '100%',
                border: '1px solid color-mix(in srgb, var(--sand-50) 20%, transparent',
                fontSize: 'var(--text-2xs)',
                padding: 'var(--space-1) var(--space-2)',
                display: 'inline-flex',
                gap: 'var(--space-2)',
                background: 'color-mix(in srgb, var(--sand-50) 15%, transparent)',
                borderRadius: 'var(--radius-full)'
                 }}><span className="stat-strip__chip-dot" style={{
                    background: 'var(--clay-400)'
                 }}></span>{drafts.length} szkice</button>
                <button className="v-btn v-btn--primary" 
            style={{ 
                height: '100%',
                border: '1px solid color-mix(in srgb, var(--sand-50) 20%, transparent',
                fontSize: 'var(--text-2xs)',
                padding: 'var(--space-1) var(--space-2)',
                display: 'inline-flex',
                gap: 'var(--space-2)',
                background: 'color-mix(in srgb, var(--sand-50) 15%, transparent)',
                borderRadius: 'var(--radius-full)'
                 }}><span className="stat-strip__chip-dot" style={{
                    background: 'var(--moss-400)'
                 }}></span>{toAccept.length} do akcept.</button>
            </div>
        </div>
        
        {/* Act twin card */}

        <div className="twin-wrapper v-fade-in--d2" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="v-act-card act--moss v-grain">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="act__icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" data-om-id="b01883c1:58">
                    <circle cx="12" cy="12" r="9" data-om-id="b01883c1:59"></circle>
                    <path d="M12 7v5l3 2" data-om-id="b01883c1:60"></path>
                    </svg>
                </div>
                <svg className="act__chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
            </div>
                    <p className="act__t">Historia</p>
                    <p className="act__s">Przeglądaj i filtruj ostatnie delegacje</p>
                    <p className="act__s">Ogólnie · od Stycznia</p>
            </div>
            
            <div className="v-act-card act--clay v-grain" style={{
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="act__icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" data-om-id="b01883c1:40"><path d="M12 5v14M5 12h14" data-om-id="b01883c1:41"></path></svg>
                    </div>
                    <svg className="act__chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
                </div>
                 <p className="act__t">Nowa delegacja</p>
                 <p className="act__s">Trasa, klient, koszty, wszystko w ~60 sekund</p>
                 <p className="act__s">Domyślnie z</p>
            </div>
        </div>

        {/* Twin buttons */}

        <div className="twin-wrapper  v-fade-in--d3">
            <button className="v-card" style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textAlign: 'left' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--clay-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--clay-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>Szkice</span>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>{drafts.length} do wysłania</span>
                </div>
            </button>
            <button className="v-card" style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textAlign: 'left' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--moss-100)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--moss-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>Duplikuj</span>
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>Z ostatnich tras</span>
                </div>
            </button>
        </div>

        </>
)
}