
import React from 'react'
import { Button } from './ui/button'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export function GameControls() {
  // For mobile controls
  const handleButtonPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Simulate keyboard events for mobile
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: direction === 'up' ? 'ArrowUp' : 
           direction === 'down' ? 'ArrowDown' : 
           direction === 'left' ? 'ArrowLeft' : 'ArrowRight'
    })
    
    window.dispatchEvent(keyDownEvent)
  }
  
  const handleButtonRelease = (direction: 'up' | 'down' | 'left' | 'right') => {
    const keyUpEvent = new KeyboardEvent('keyup', {
      key: direction === 'up' ? 'ArrowUp' : 
           direction === 'down' ? 'ArrowDown' : 
           direction === 'left' ? 'ArrowLeft' : 'ArrowRight'
    })
    
    window.dispatchEvent(keyUpEvent)
  }
  
  return (
    <div className="md:hidden absolute bottom-4 right-4 grid grid-cols-3 gap-2">
      <div></div>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-black/50 border-cyan-500 text-cyan-500"
        onTouchStart={() => handleButtonPress('up')}
        onTouchEnd={() => handleButtonRelease('up')}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
      <div></div>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-black/50 border-cyan-500 text-cyan-500"
        onTouchStart={() => handleButtonPress('left')}
        onTouchEnd={() => handleButtonRelease('left')}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div></div>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-black/50 border-cyan-500 text-cyan-500"
        onTouchStart={() => handleButtonPress('right')}
        onTouchEnd={() => handleButtonRelease('right')}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <div></div>
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-black/50 border-cyan-500 text-cyan-500"
        onTouchStart={() => handleButtonPress('down')}
        onTouchEnd={() => handleButtonRelease('down')}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
      <div></div>
    </div>
  )
}