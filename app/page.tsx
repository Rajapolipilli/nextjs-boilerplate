'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [showFront, setShowFront] = useState(true)
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
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
        {frontImage && backImage ? (
          <Image
            src={showFront ? frontImage : backImage}
            alt={showFront ? 'Front Image' : 'Back Image'}
            fill
            unoptimized
            sizes="100%"
            className="object-contain rounded shadow-lg transition duration-500"
            priority
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowFront(!showFront)}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
            showFront ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
              showFront ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <div className="text-sm text-gray-700 mt-2 text-center">
          Showing: <span className="font-medium">{showFront ? 'Front' : 'Back'}</span>
        </div>
      </div>
    </main>
  )
}
