
import React from 'react'

interface PlayerProps {
  x: number
  y: number
}

export function Player({ x, y }: PlayerProps) {
  return (
    <div 
      className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
}