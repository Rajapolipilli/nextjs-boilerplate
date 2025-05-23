'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader, VideoTexture, LinearFilter } from 'three'

type ViewMode = 'front' | 'back' | '3d' | 'stats'

export default function Home() {
  const [view, setView] = useState<ViewMode>('3d')
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const [frontType, setFrontType] = useState<string | null>(null)
  const [backType, setBackType] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const detectMime = async (url: string): Promise<string | null> => {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        return res.headers.get('content-type')
      } catch (e) {
        console.error(`Error fetching content-type for ${url}`, e)
        return null
      }
    }

    const loadMedia = async () => {
      const params = new URLSearchParams(window.location.search)
      const front = params.get('front')
      const back = params.get('back')
      const isArweave = params.get('arweave')?.toLowerCase() === 'true'

      if (front && back) {
        const base = isArweave
          ? 'https://arweave.net'
          : 'https://pink-junior-peacock-757.mypinata.cloud/ipfs'

        const frontMediaUrl = `${base}/${front}`
        const backMediaUrl = `${base}/${back}`

        setFrontUrl(frontMediaUrl)
        setBackUrl(backMediaUrl)

        const [ftype, btype] = await Promise.all([
          detectMime(frontMediaUrl),
          detectMime(backMediaUrl),
        ])

        setFrontType(ftype)
        setBackType(btype)
      }
    }

    loadMedia()
  }, [])

  const renderMedia = (url: string, type: string | null) => {
    if (type?.startsWith('video')) {
      return (
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain rounded"
        />
      )
    } else {
      return (
        <Image
          src={url}
          alt="media"
          fill
          unoptimized
          className="object-contain rounded"
          sizes="100%"
        />
      )
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black-100 p-4">
      <div className="relative w-[500px] h-[500px] sm:w-[400px] sm:h-[400px] bg-black rounded shadow-lg">
        {frontUrl && backUrl ? (
          view === '3d' ? (
            <Canvas className="rounded">
              <ambientLight intensity={0.8} />
              <directionalLight position={[0, 0, 5]} intensity={1} />
              <OrbitControls enableZoom={false} />
              <Card3D
                frontUrl={frontUrl}
                backUrl={backUrl}
                frontType={frontType}
                backType={backType}
              />
            </Canvas>
          ) : view === 'front' ? (
            renderMedia(frontUrl, frontType)
          ) : view === 'back' ? (
            renderMedia(backUrl, backType)
          ) : null
        ) : (
          <p className="text-center">Loading media...</p>
        )}
      </div>

      <div className="mt-6 flex gap-4 relative">
        {(['3d', 'front', 'back'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setView(mode)
              setShowStats(false)
            }}
            className={`px-4 py-2 rounded ${
              view === mode ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}

        {/* STATS BUTTON with CALLOUT */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => {
              setView('stats')
              setShowStats((prev) => !prev)
            }}
            className={`px-4 py-2 rounded ${
              showStats ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            STATS
          </button>

          {showStats && (
            <div className="absolute bottom-12 w-64 p-4 bg-white border border-gray-300 rounded-xl shadow-xl text-sm z-50">
              {/* Downward pointing triangle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-300 z-[-1]" />
              <h2 className="text-base font-semibold mb-2">Card Stats</h2>
              <ul className="space-y-1">
                <li><strong>Name:</strong> Luka D James </li>
                <li><strong>Description:</strong> Limited edition card</li>
                <li><strong>Origin:</strong> Arweave</li>
                <li><strong>Metadata:</strong> Rarity: Legendary | Season: 2025</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function Card3D({
  frontUrl,
  backUrl,
  frontType,
  backType,
}: {
  frontUrl: string
  backUrl: string
  frontType: string | null
  backType: string | null
}) {
  const isFrontVideo :any = frontType?.startsWith('video')
  const isBackVideo :any = backType?.startsWith('video')

  const [frontTexture, setFrontTexture] = useState<any>(null)
  const [backTexture, setBackTexture] = useState<any>(null)

  useEffect(() => {
    const loadTexture = async (
      url: string,
      isVideo: boolean,
      setTexture: (tex: any) => void
    ) => {
      if (isVideo) {
        const video = document.createElement('video')
        video.src = url
        video.crossOrigin = 'anonymous'
        video.loop = true
        video.muted = true
        video.playsInline = true
        await video.play()
        const videoTex = new VideoTexture(video)
        videoTex.minFilter = LinearFilter
        videoTex.magFilter = LinearFilter
        setTexture(videoTex)
      } else {
        const loader = new TextureLoader()
        loader.load(url, (tex) => setTexture(tex))
      }
    }

    loadTexture(frontUrl, isFrontVideo, setFrontTexture)
    loadTexture(backUrl, isBackVideo, setBackTexture)
  }, [frontUrl, backUrl, isFrontVideo, isBackVideo])

  useFrame((state) => {
    state.scene.rotation.y += 0.005
  })

  if (!frontTexture || !backTexture) return null

  return (
    <mesh>
      <boxGeometry args={[5, 7, 0.3]} />
      <meshStandardMaterial attach="material-0" color="gold" />
      <meshStandardMaterial attach="material-1" color="gold" />
      <meshStandardMaterial attach="material-2" color="gold" />
      <meshStandardMaterial attach="material-3" color="gold" />
      <meshStandardMaterial attach="material-4" map={frontTexture} />
      <meshStandardMaterial attach="material-5" map={backTexture} />
    </mesh>
  )
}
