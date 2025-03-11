'use client' // Error boundaries must be Client Components

import FuzzyText from '@/components/reactbits/FuzzyText'
import { useState, useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [hoverIntensity, setHoverIntensity] = useState(0.5)
  const [enableHover, setEnableHover] = useState(true)
  
  // 効果の強度を自動的に変化させるアニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setHoverIntensity(prev => {
        const newValue = prev + 0.01
        return newValue > 0.7 ? 0.3 : newValue
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 scale-150 transform">
          <FuzzyText 
            baseIntensity={0.3} 
            hoverIntensity={hoverIntensity} 
            enableHover={enableHover}
            fontSize="clamp(6rem, 15vw, 12rem)"
            fontWeight={900}
            color="#ff3333"
          >
            Error
          </FuzzyText>
        </div>
        
        <div className="mt-2">
          <FuzzyText 
            baseIntensity={0.1} 
            hoverIntensity={hoverIntensity} 
            enableHover={enableHover}
            fontSize="clamp(2.5rem, 4vw, 2.5rem)"
            fontWeight={700}
            color="#ffffff"
          >
            {error.message || 'Something went wrong!'}
          </FuzzyText>
        </div>

        {/* <div className="mt-10">
          <button 
            onClick={() => reset()} 
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 group-hover:from-red-500 group-hover:to-pink-500"
          >
            <span className="relative rounded-md bg-transparent px-5 py-2.5 transition-all duration-75 ease-in">
              <FuzzyText 
                baseIntensity={0.1} 
                hoverIntensity={0.4} 
                enableHover={true}
                fontSize="1.2rem"
                fontWeight={600}
                color="#ffffff"
              >
                Try again
              </FuzzyText>
            </span>
          </button>
        </div> */}
      </div>

      {error.digest && (
        <div className="absolute bottom-4 right-4 text-[10px] text-gray-600 opacity-50 hover:opacity-100 transition-opacity">
          error digest: {error.digest}
        </div>
      )}
    </div>
  )
}