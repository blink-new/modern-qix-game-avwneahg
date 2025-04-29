
import React from 'react'

interface SparxProps {
  x: number
  y: number
}

export function Sparx({ x, y }: SparxProps) {
  return (
    <div 
      className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(255,255,0,0.8)]"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
}