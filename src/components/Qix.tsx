
import React, { useEffect, useRef } from 'react'

interface QixProps {
  x: number
  y: number
  size: number
}

export function Qix({ x, y, size }: QixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    
    const draw = (time: number) => {
      ctx.clearRect(0, 0, size * 2, size * 2)
      
      const points = 8
      const innerRadius = size / 3
      const outerRadius = size
      
      ctx.beginPath()
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI * 2 * i) / (points * 2) + time / 1000
        const pointX = size + Math.cos(angle) * radius
        const pointY = size + Math.sin(angle) * radius
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY)
        } else {
          ctx.lineTo(pointX, pointY)
        }
      }
      
      ctx.closePath()
      ctx.fillStyle = `hsl(${(time / 10) % 360}, 100%, 50%)`
      ctx.fill()
      
      animationId = requestAnimationFrame(draw)
    }
    
    animationId = requestAnimationFrame(draw)
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [size])
  
  return (
    <canvas
      ref={canvasRef}
      width={size * 2}
      height={size * 2}
      className="absolute"
      style={{ 
        left: `${x - size}px`, 
        top: `${y - size}px`,
      }}
    />
  )
}