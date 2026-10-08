import { useEffect } from 'react'
import { profile, sections } from '../content/cv'
import { sectionComponents } from '../sections'
import { parseAnchor, parseHash, useHash } from '../lib/route'

/** Plain, scrollable, print-friendly page with all content. Default for reduced motion / low-end devices. */
export default function ClassicView({ toggle }: { toggle: React.ReactNode }) {
  const hash = useHash()
  const section = parseHash(hash)
  const anchor = parseAnchor(hash)

  useEffect(() => {
    const el = (anchor && document.getElementById(`case-${anchor}`)) || (section && document.getElementById(`sec-${section}`))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [section, anchor])

  return (
    <div className="classic">
      <header className="classic-head">
        <a href="#/" className="brand">
          {profile.shortName}
        </a>
        <nav aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#/${s.id}`} aria-current={section === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        {toggle}
      </header>

      <main>
        <section className="classic-hero">
          <p className="hero-status">
            <span className="dot" /> {profile.seeking.headline}
          </p>
          <h1>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p className="hero-pitch">{profile.pitch}</p>
          <p className="cta-row">
            <a className="btn primary" href={`mailto:${profile.email}`}>
              Email me
            </a>
            <a className="btn" href={profile.cv} target="_blank" rel="noreferrer">
              Download CV
            </a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
          <ul className="proof">
            {profile.proof.map((p) => (
              <li key={p.label}>
                <strong>{p.label}</strong>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {sections.map((s) => {
          const Content = sectionComponents[s.id]
          return (
            <section key={s.id} id={`sec-${s.id}`} className="classic-sec" aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`}>
                <span className="sec-rack">{s.rack}</span> {s.label}
              </h2>
              <Content focus={section === s.id ? anchor : null} />
            </section>
          )
        })}
      </main>

      <footer className="classic-foot">
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </footer>
    </div>
  )
}
