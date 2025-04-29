
import React from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface GameOverProps {
  score: number
  percentageClaimed: number
  onRestart: () => void
}

export function GameOver({ score, percentageClaimed, onRestart }: GameOverProps) {
  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md p-8 rounded-xl max-w-md w-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Game Over
      </motion.h2>
      
      <motion.div 
        className="text-white mb-8 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="bg-black/30 p-4 rounded-lg mb-4">
          <p className="text-xl">
            <span className="text-cyan-400 font-bold">Final Score:</span> 
            <span className="text-white ml-2">{score}</span>
          </p>
          <p className="text-xl">
            <span className="text-yellow-400 font-bold">Territory Claimed:</span> 
            <span className="text-white ml-2">{percentageClaimed}%</span>
          </p>
        </div>
        
        <p className="text-white/80">Can you claim more territory next time?</p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button 
          onClick={onRestart}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Play Again
        </Button>
      </motion.div>
    </motion.div>
  )
}