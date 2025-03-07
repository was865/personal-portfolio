"use client"

import FuzzyText from '@/components/reactbits/FuzzyText'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const [hoverIntensity, setHoverIntensity] = useState(0.5)
  const [enableHover, setEnableHover] = useState(true)
  
  // 自动改变效果强度的动画
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
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white">
          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
            <div className="mb-6 scale-150 transform">
              <FuzzyText 
                baseIntensity={0.2} 
                hoverIntensity={hoverIntensity} 
                enableHover={enableHover}
                fontSize="clamp(6rem, 15vw, 12rem)"
                fontWeight={900}
                color="#ffffff"
              >
                404
              </FuzzyText>
            </div>
            
            <div className="mt-2">
            <FuzzyText 
              baseIntensity={0.3} 
              hoverIntensity={hoverIntensity} 
              enableHover={enableHover}
              fontSize="clamp(1.5rem, 4vw, 2.5rem)"
              fontWeight={700}
              color="#ffffff"
            >
              NOT FOUND
            </FuzzyText>
          </div>
          </div>
        </div>
    </body>
    </html>
  )
}
