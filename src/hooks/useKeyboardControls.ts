
import { useState, useEffect } from 'react'

interface Keys {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  shift: boolean
}

export function useKeyboardControls() {
  const [keys, setKeys] = useState<Keys>({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false
  })
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key)) {
        setKeys(prev => ({ ...prev, up: true }))
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.key)) {
        setKeys(prev => ({ ...prev, down: true }))
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key)) {
        setKeys(prev => ({ ...prev, left: true }))
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key)) {
        setKeys(prev => ({ ...prev, right: true }))
      } else if (['ShiftLeft', 'ShiftRight', 'Shift'].includes(e.key)) {
        setKeys(prev => ({ ...prev, shift: true }))
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key)) {
        setKeys(prev => ({ ...prev, up: false }))
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.key)) {
        setKeys(prev => ({ ...prev, down: false }))
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key)) {
        setKeys(prev => ({ ...prev, left: false }))
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key)) {
        setKeys(prev => ({ ...prev, right: false }))
      } else if (['ShiftLeft', 'ShiftRight', 'Shift'].includes(e.key)) {
        setKeys(prev => ({ ...prev, shift: false }))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  
  return { keys }
}