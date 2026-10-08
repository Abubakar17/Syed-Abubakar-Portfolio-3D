import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, useProgress } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { ACESFilmicToneMapping } from 'three'
import { useStore } from '../lib/store'
import { input, MOVE_KEYS } from '../lib/input'
import { navigate } from '../lib/route'
import LoadingScreen from '../ui/LoadingScreen'
import Aisle from './Aisle'
import SectionRacks from './SectionRacks'
import Avatar from './Avatar'
import CameraRig from './CameraRig'
import Director from './Director'
import Portal from './Portal'

function Ready() {
  const setSceneReady = useStore((s) => s.setSceneReady)
  useEffect(() => {
    setSceneReady(true)
    return () => setSceneReady(false)
  }, [setSceneReady])
  return null
}

function useKeyboard() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const { phase, nearest } = useStore.getState()
      const tag = (e.target as HTMLElement)?.tagName
      if (phase !== 'aisle' || tag === 'INPUT' || tag === 'TEXTAREA') return
      if (MOVE_KEYS.has(e.code)) {
        input.keys.add(e.code)
        if (e.code.startsWith('Arrow')) e.preventDefault()
      } else if (e.key === 'Enter' && nearest && tag !== 'BUTTON' && tag !== 'A') {
        e.preventDefault()
        navigate(nearest)
      }
    }
    const up = (e: KeyboardEvent) => input.keys.delete(e.code)
    const clear = () => input.keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    const unsub = useStore.subscribe((s) => s.phase !== 'aisle' && clear())
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      unsub()
    }
  }, [])
}

function Loader() {
  const { progress, active } = useProgress()
  const ready = useStore((s) => s.sceneReady)
  return <LoadingScreen progress={progress} done={ready && !active} />
}

export default function World() {
  useKeyboard()
  const phase = useStore((s) => s.phase)
  const [quality, setQuality] = useState<'high' | 'low'>('high')

  return (
    <>
      <Canvas
        className="world"
        // Freeze rendering while a section overlay covers the scene.
        frameloop={phase === 'open' ? 'never' : 'always'}
        dpr={quality === 'high' ? [1, 1.75] : [0.75, 1]}
        camera={{ fov: 50, near: 0.1, far: 40, position: [0, 2.3, 6.5] }}
        gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
        onPointerMissed={() => (document.body.style.cursor = '')}
      >
        <PerformanceMonitor onDecline={() => setQuality('low')} flipflops={2} onFallback={() => setQuality('low')} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <Aisle />
          <SectionRacks />
          <Avatar />
          <Portal />
          <Director />
          <CameraRig />
          <Ready />
        </Suspense>
        {quality === 'high' ? (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.75} />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.9} radius={0.5} />
          </EffectComposer>
        )}
      </Canvas>
      <Loader />
    </>
  )
}
