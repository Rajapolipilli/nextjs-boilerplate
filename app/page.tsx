'use client'

import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { OrbitControls } from '@react-three/drei'

type ViewMode = 'front' | 'back' | '3d'

export default function Home() {
  const [view, setView] = useState<ViewMode>('3d')
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const front = params.get('front')
    const back = params.get('back')

    if (front && back) {
      setFrontImage(`https://pink-junior-peacock-757.mypinata.cloud/ipfs/${front}`)
      setBackImage(`https://pink-junior-peacock-757.mypinata.cloud/ipfs/${back}`)
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="relative w-[500px] h-[500px] sm:w-[400px] sm:h-[400px] bg-white rounded shadow-lg">
        {frontImage && backImage ? (
          view === '3d' ? (
            <Canvas className="rounded">
              <Suspense fallback={null}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[0, 0, 5]} intensity={1} />
                <OrbitControls enableZoom={false} />
                <Card3D frontUrl={frontImage} backUrl={backImage} />
              </Suspense>
            </Canvas>
          ) : (
            <Image
              src={view === 'front' ? frontImage : backImage}
              alt={`${view} Image`}
              fill
              unoptimized
              sizes="100%"
              className="object-contain rounded"
              priority
            />
          )
        ) : (
          <p className="text-center">Loading images...</p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        {(['3d','front', 'back'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`px-4 py-2 rounded ${
              view === mode ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
    </main>
  )
}





function Card3D({ frontUrl, backUrl }: { frontUrl: string; backUrl: string }) {
  const frontTexture = useLoader(TextureLoader, frontUrl)
  const backTexture = useLoader(TextureLoader, backUrl)

  useFrame((state) => {
    state.scene.rotation.y += 0.005
  })

  return (
    <mesh>
      {/* Width: 5, Height: 7, Depth: 0.3 */}
      <boxGeometry args={[5, 7, 0.3]} />
      {/* Material index order: right, left, top, bottom, front, back */}
      <meshStandardMaterial attach="material-0" color="gold" />
      <meshStandardMaterial attach="material-1" color="gold" />
      <meshStandardMaterial attach="material-2" color="gold" />
      <meshStandardMaterial attach="material-3" color="gold" />
      <meshStandardMaterial attach="material-4" map={frontTexture} />
      <meshStandardMaterial attach="material-5" map={backTexture} />
    </mesh>
  )
}

