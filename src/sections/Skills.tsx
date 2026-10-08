import { skills } from '../content/cv'

export default function Skills() {
  return (
    <div className="sec skills">
      {skills.map((g) => (
        <section key={g.group} className="skill-group">
          <h3>{g.group}</h3>
          <ul className="tags big">
            {g.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
