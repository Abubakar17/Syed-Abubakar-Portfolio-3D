import { featuredProjects, moreProjects, papers, type CaseStudy } from '../content/cv'

function Case({ c, open }: { c: CaseStudy; open: boolean }) {
  return (
    <article className="case" id={`case-${c.id}`}>
      <div className="case-top">
        <div>
          <p className="kicker">{c.kicker}</p>
          <h3>{c.title}</h3>
          <p className="case-meta">{c.meta}</p>
        </div>
        <div className="metric">
          <strong>{c.metric.value}</strong>
          <span>{c.metric.label}</span>
        </div>
      </div>
      <p>{c.summary}</p>
      <ol className="chain" aria-label="Pipeline">
        {c.chain.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="role">
        <span className="k">my role</span> {c.role}
      </p>
      <details open={open}>
        <summary>Case study</summary>
        <div className="case-body">
          <h4>Problem</h4>
          <p>{c.problem}</p>
          <h4>Approach</h4>
          <p>{c.approach}</p>
          <ul className="results">
            {c.results.map((r) => (
              <li key={r.label}>
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>
          {c.note && <p className="note">{c.note}</p>}
          <h4>My contribution</h4>
          <p>{c.contribution}</p>
          <ul className="tags">
            {c.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </details>
      {c.links.length > 0 && (
        <p className="links">
          {c.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </p>
      )}
    </article>
  )
}

/** `focus` = a case-study id from the URL (e.g. #/projects/deepdive) to expand. */
export default function Projects({ focus }: { focus?: string | null }) {
  return (
    <div className="sec sec-projects">
      <div className="cases">
        {featuredProjects.map((c) => (
          <Case key={c.id} c={c} open={focus === c.id} />
        ))}
      </div>

      <h3 className="sub">Publications</h3>
      <ul className="papers">
        {papers.map((p) => (
          <li key={p.title}>
            <p className="paper-title">{p.title}</p>
            <p className="paper-meta">
              {p.authors} · <em>{p.venue}</em> · {p.status}
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="sub">More projects</h3>
      <ul className="card-grid">
        {moreProjects.map((p) => (
          <li key={p.title} className="card">
            <h4>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noreferrer">
                  {p.title} ↗
                </a>
              ) : (
                p.title
              )}
              <span className="year">{p.year}</span>
            </h4>
            <p>{p.summary}</p>
            <ul className="tags">
              {p.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
