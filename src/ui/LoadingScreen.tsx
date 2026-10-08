import { useEffect, useState } from 'react'

/** `progress` undefined → indeterminate (renderer chunk still downloading). */
export default function LoadingScreen({ progress, done = false }: { progress?: number; done?: boolean }) {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    if (!done) return setGone(false)
    const t = setTimeout(() => setGone(true), 700)
    return () => clearTimeout(t)
  }, [done])
  if (gone) return null

  const pct = progress === undefined ? undefined : Math.round(progress)
  return (
    <div className={`loading ${done ? 'is-done' : ''}`} role="status" aria-live="polite">
      <div className="loading-box">
        <p className="loading-line">
          <span className="ok">$</span> boot dc-01 --aisle cold
        </p>
        <p className="loading-line muted">
          {pct === undefined ? 'fetching renderer…' : pct < 100 ? `loading assets… ${pct}%` : 'powering racks…'}
        </p>
        <div className={`bar ${pct === undefined ? 'indeterminate' : ''}`}>
          <span style={pct === undefined ? undefined : { width: `${Math.max(4, pct)}%` }} />
        </div>
      </div>
    </div>
  )
}
