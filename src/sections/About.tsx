import { about, profile } from '../content/cv'

export default function About() {
  return (
    <div className="sec sec-about">
      <div className="kv-grid">
        <div><span className="k">role</span><span className="v">{profile.title}</span></div>
        <div><span className="k">location</span><span className="v">{profile.location}</span></div>
        <div><span className="k">status</span><span className="v ok">{profile.seeking.headline}</span></div>
        <div><span className="k">focus</span><span className="v">{profile.seeking.focus}</span></div>
      </div>
      {about.paragraphs.map((p, i) => (
        <p key={i} className="lead-p">{p}</p>
      ))}
      <h3 className="sub">Research direction</h3>
      <p className="lead-p">{about.research}</p>
      <ul className="card-grid">
        {about.interests.map((it) => (
          <li key={it.title} className="card">
            <h4>{it.title}</h4>
            <p>{it.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
