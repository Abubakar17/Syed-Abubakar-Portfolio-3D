import { profile, sections } from '../content/cv'
import { navigate } from '../lib/route'
import { useStore } from '../lib/store'

/** Landing card over the 3D scene — name, title and pitch are visible before any interaction. */
export default function Hero() {
  const phase = useStore((s) => s.phase)
  const moved = useStore((s) => s.hasMoved)
  if (phase === 'open') return null

  return (
    <header className={`hero ${moved ? 'is-compact' : ''} ${phase !== 'aisle' ? 'is-hidden' : ''}`}>
      <p className="hero-status">
        <span className="dot" /> {profile.seeking.headline}
      </p>
      <h1>{profile.name}</h1>
      <p className="hero-title">{profile.title}</p>
      <p className="hero-pitch">{profile.pitch}</p>
      <nav className="chips" aria-label="Sections">
        {sections.map((s) => (
          <button key={s.id} type="button" onClick={() => navigate(s.id)}>
            {s.label}
          </button>
        ))}
        <a href={profile.cv} target="_blank" rel="noreferrer" className="chip-cv">
          CV ↓
        </a>
      </nav>
    </header>
  )
}
