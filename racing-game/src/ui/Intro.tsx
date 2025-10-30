import React, { Suspense, useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { useStore } from '../store'
import { setupSession } from '../data'
import { Keys } from './Keys'

// Import custom animations
import './intro.css'

interface IntroProps {
  children: React.ReactNode
}

export function Intro({ children }: IntroProps): React.ReactElement {
  const [clicked, setClicked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const { progress } = useProgress()
  const [session, set] = useStore((state: any) => [state.session, state.set])

  useEffect(() => {
    if (clicked && !loading) set({ ready: true })
  }, [clicked, loading])

  useEffect(() => {
    if (progress === 100) setLoading(false)
  }, [progress])

  useEffect(() => {
    setupSession(set)
  }, [])

  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <div className={`fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900
        ${loading ? 'opacity-100' : 'opacity-95'} 
        ${clicked ? 'animate-fade-out' : 'animate-fade-in'}
        transition-opacity duration-500 z-50`}>
        <div className="relative flex flex-col items-center space-y-8">
          <div className="intro-keys backdrop-blur-lg bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl">
            <Keys style={{ paddingBottom: 20 }} />
            <button
              onClick={() => setClicked(true)}
              className={`
                relative w-full px-8 py-4 text-lg font-medium text-white
                rounded-lg overflow-hidden transition-all duration-300
                ${loading ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer'}
                transform hover:scale-105 active:scale-95
              `}
            >
              <div className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2">{progress.toFixed()}%</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Click to Start
                    <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
              </div>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 animate-shimmer" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
