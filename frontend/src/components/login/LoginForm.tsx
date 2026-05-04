import '../../styles/tokens.css'
import '../../styles/components.css'
import PageFooter from './PageFooter'

interface LoginFormProps {
  email: string
  password: string
  error: string
  onMailChange: (value: string) => void
  onPassWordChange: (value: string) => void
  onSubmit: () => void
}

export default function LoginForm({ email, password, error, onMailChange, onPassWordChange, onSubmit }: LoginFormProps) {
  return (
    <>
    <div className='v-card v-card--elevated v-login-card' style={{
      flex: 1,
      borderTopLeftRadius: 'var(--radius-2xl)',
      borderTopRightRadius: 'var(--radius-2xl)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      padding: 'var(--space-6)',
      paddingTop: 'var(--space-3)'
      }}>
      <hr className="v-divider" />
      <h2 style={{
        textAlign: 'left',
        fontWeight: 'var(--fw-bold)',
        marginTop: 0
      }}>
        Logowanie
      </h2>
      <div className='v-field' style={{gap: 'var(--space-4)'}}> 
            <div className="v-input-group">
          <svg className="v-input-group__icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
          </svg>
          <input
          id="email"
          className="v-input"
          type="email"
          placeholder="E-mail służbowy"
          value={email}
          onChange={e => onMailChange(e.target.value)}
          autoComplete="email"
        />
            </div>
               <div className="v-input-group">
          <svg className="v-input-group__icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
          id="password"
          className="v-input"
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => onPassWordChange(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button className='t-caption' style={{ textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', color: 'var(--text-secondary)' }}>ZRESETUJ HASŁO</button>

      <p className="v-field__hint v-field__hint--error">{error}</p>

      <button className='v-btn v-btn--primary v-btn--block' onClick={onSubmit}>
        Zaloguj
      </button>
      <button className='v-btn v-btn--secondary v-btn--block'>
        <svg className="v-btn__icon" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
          <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
          <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
          <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
        </svg>
      Logowanie Azure
      </button>
  </div>
    <PageFooter />
  </div>

  </>
  )
}
