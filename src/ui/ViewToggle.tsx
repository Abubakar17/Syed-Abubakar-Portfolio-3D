import type { ViewMode } from '../lib/device'

export default function ViewToggle({ view, onChange, disabled3D }: { view: ViewMode; onChange: (v: ViewMode) => void; disabled3D?: boolean }) {
  const next: ViewMode = view === '3d' ? 'classic' : '3d'
  if (next === '3d' && disabled3D) return null
  return (
    <button type="button" className="view-toggle" onClick={() => onChange(next)} aria-label={`Switch to ${next === '3d' ? '3D' : 'classic'} view`}>
      {next === 'classic' ? '☰ Classic view' : '◈ 3D view'}
    </button>
  )
}
