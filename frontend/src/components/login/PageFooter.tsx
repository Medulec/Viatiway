import '../../styles/tokens.css'

export default function PageFooter() {
  return (
    <footer style={{
      padding: 'var(--space-6) var(--space-4)',
      textAlign: 'center',
    }}>
      <p className="t-caption">
        Viatiway · {new Date().getFullYear()} · v1.0.0
      </p>
      <p className="t-caption">
        Polityka prywatności
      </p>
    </footer>
  )
}