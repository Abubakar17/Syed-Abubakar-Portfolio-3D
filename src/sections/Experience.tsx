import { experience } from '../content/cv'

export default function Experience() {
  return (
    <ol className="sec timeline">
      {experience.map((job) => (
        <li key={job.company + job.period} className="tl-item">
          <div className="tl-head">
            <h3>
              {job.role} <span className="at">@ {job.company}</span>
            </h3>
            <span className="tl-meta">
              {job.period} · {job.location}
            </span>
          </div>
          <p className="tl-sum">{job.summary}</p>
          <ul className="bullets">
            {job.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <ul className="tags">
            {job.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
