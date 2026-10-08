import { lazy, Suspense, useEffect, useState } from 'react'
import { canRun3D, initialView, isTouch, saveView, type ViewMode } from './lib/device'
import { parseHash, useHash } from './lib/route'
import { useStore } from './lib/store'
import Hero from './ui/Hero'
import Overlay from './ui/Overlay'
import ViewToggle from './ui/ViewToggle'
import Joystick from './ui/Joystick'
import ClassicView from './ui/ClassicView'
import LoadingScreen from './ui/LoadingScreen'

// The whole 3D stack (three, r3f, drei, postprocessing) lives in this chunk — classic view never downloads it.
const World = lazy(() => import('./scene/World'))

export default function App() {
  const [view, setView] = useState<ViewMode>(() => (canRun3D() ? initialView() : 'classic'))
  const section = parseHash(useHash())
  const changeView = (v: ViewMode) => {
    saveView(v)
    setView(v)
  }

  // The URL hash is the source of truth for which rack is open.
  useEffect(() => {
    if (view !== '3d') return
    const { open, close } = useStore.getState()
    if (section) open(section)
    else close()
  }, [section, view])

  useEffect(() => {
    if (view === 'classic') useStore.getState().close(true)
    document.documentElement.dataset.view = view
  }, [view])

  const toggle = <ViewToggle view={view} onChange={changeView} disabled3D={!canRun3D()} />

  if (view === 'classic') return <ClassicView toggle={toggle} />

  return (
    <div className="stage">
      <Suspense fallback={<LoadingScreen />}>
        <World />
      </Suspense>
      <Hero />
      <Hint />
      {isTouch() && <Joystick />}
      <div className="top-right">{toggle}</div>
      <Overlay />
    </div>
  )
}

function Hint() {
  const phase = useStore((s) => s.phase)
  if (phase !== 'aisle') return null
  return (
    <p className="controls-hint" aria-hidden>
      {isTouch() ? (
        <>Drag the joystick to walk · tap a rack to open it</>
      ) : (
        <>
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> / <kbd>←↑↓→</kbd> walk · <kbd>Enter</kbd> open rack · or click any glowing rack
        </>
      )}
    </p>
  )
}
