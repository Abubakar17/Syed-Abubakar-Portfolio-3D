import { education, honors } from '../content/cv'

export default function Education() {
  return (
    <div className="sec">
      <ol className="timeline">
        {education.map((e) => (
          <li key={e.degree} className="tl-item">
            <div className="tl-head">
              <h3>{e.degree}</h3>
              <span className="tl-meta">{e.period}</span>
            </div>
            <p className="badge">{e.badge}</p>
            <p className="tl-sum">{e.school}</p>
            <p className="muted">{e.detail}</p>
          </li>
        ))}
      </ol>
      <h3 className="sub">Honors &amp; awards</h3>
      <ul className="honors">
        {honors.map((h) => (
          <li key={h.year + h.title}>
            <span className="year">{h.year}</span>
            <div>
              <strong>{h.title}</strong>
              {h.org && <span className="muted"> · {h.org}</span>}
              {h.text && <p>{h.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
