
import React from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface GameStartProps {
  onStart: () => void
}

export function GameStart({ onStart }: GameStartProps) {
  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md w-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Modern Qix
      </motion.h2>
      
      <motion.div 
        className="text-white/80 mb-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p>Claim territory by drawing lines while avoiding enemies!</p>
        <p>Capture 75% of the screen to advance to the next level.</p>
        <p>Watch out for the Qix and Sparx - they'll cost you a life!</p>
      </motion.div>
      
      <motion.div
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="text-white/70 mb-4">
          <p>Controls:</p>
          <p>Arrow keys or WASD to move</p>
          <p>Hold Shift for fast movement</p>
        </div>
        
        <Button 
          onClick={onStart}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Game
        </Button>
      </motion.div>
    </motion.div>
  )
}