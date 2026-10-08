import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, sections } from '../content/cv'
import { sectionComponents } from '../sections'
import { navigate, parseAnchor, useHash } from '../lib/route'
import { useStore } from '../lib/store'
import { prefersReducedMotion } from '../lib/device'

/** Full-screen terminal/dashboard window that shows a section's content. */
export default function Overlay() {
  const phase = useStore((s) => s.phase)
  const active = useStore((s) => s.active)
  const show = phase === 'open' && !!active
  const reduced = prefersReducedMotion()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          className="overlay"
          initial={reduced ? { opacity: 0 } : { opacity: 0, backgroundColor: 'rgba(56,225,255,0.55)' }}
          animate={{ opacity: 1, backgroundColor: 'rgba(3,6,10,0.88)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: 'easeOut' }}
        >
          <Window id={active!} reduced={reduced} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Window({ id, reduced }: { id: NonNullable<ReturnType<typeof useStore.getState>['active']>; reduced: boolean }) {
  const meta = sections.find((s) => s.id === id)!
  const Content = sectionComponents[id]
  const body = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const hash = useHash()
  const anchor = parseAnchor(hash)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && navigate(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // New section → scroll to top (or to a deep-linked case study) and move focus for screen readers.
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    const target = anchor ? document.getElementById(`case-${anchor}`) : null
    if (target) target.scrollIntoView({ block: 'start' })
    else body.current?.scrollTo({ top: 0 })
  }, [id, anchor])

  return (
    <motion.section
      className="term"
      role="dialog"
      aria-modal="true"
      aria-labelledby="term-title"
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      transition={{ duration: reduced ? 0.1 : 0.4, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="term-bar">
        <span className="term-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="term-path">
          abubakar@dc-01:~/racks/{meta.rack.split(' ')[1].toLowerCase()}
        </span>
        <button type="button" className="btn back" onClick={() => navigate(null)}>
          ← Back to aisle <kbd>Esc</kbd>
        </button>
      </div>

      <nav className="term-tabs" aria-label="Sections">
        {sections.map((s) => (
          <button key={s.id} type="button" aria-current={s.id === id ? 'page' : undefined} onClick={() => navigate(s.id)}>
            <span className="tab-rack">{s.rack.split(' ')[1]}</span> {s.label}
          </button>
        ))}
      </nav>

      <div className="term-body" ref={body}>
        <p className="prompt" key={id}>
          <span className="ok">abubakar@{meta.host}</span>
          <span className="muted">:~$</span> <span className="typed">{meta.cmd}</span>
        </p>
        <h2 id="term-title" ref={heading} tabIndex={-1}>
          {meta.label}
        </h2>
        <Content focus={anchor} />
      </div>

      <footer className="term-status">
        <span>
          <span className="ok">●</span> {meta.rack} · online
        </span>
        <span className="muted hide-sm">{profile.email}</span>
        <span className="muted">Esc → aisle</span>
      </footer>
    </motion.section>
  )
}
