import { profile } from '../content/cv'

export default function Contact() {
  const rows = [
    { k: 'email', v: profile.email, href: `mailto:${profile.email}` },
    { k: 'linkedin', v: 'linkedin.com/in/s-m-abubakar', href: profile.linkedin },
    { k: 'github', v: 'github.com/Abubakar17', href: profile.github },
    { k: 'cv', v: 'CV_SyedMuhammadAbubakar.pdf', href: profile.cv },
  ]
  return (
    <div className="sec contact">
      <p className="lead-p">
        <span className="ok">● {profile.seeking.headline}</span> — {profile.seeking.role}, {profile.seeking.focus}. Based in{' '}
        {profile.location}.
      </p>
      <ul className="contact-list">
        {rows.map((r) => (
          <li key={r.k}>
            <span className="k">{r.k}</span>
            <a href={r.href} target={r.k === 'email' ? undefined : '_blank'} rel="noreferrer">
              {r.v}
            </a>
          </li>
        ))}
      </ul>
      <p className="cta-row">
        <a className="btn primary" href={`mailto:${profile.email}`}>
          Email me
        </a>
        <a className="btn" href={profile.cv} target="_blank" rel="noreferrer">
          Download CV
        </a>
      </p>
    </div>
  )
}
