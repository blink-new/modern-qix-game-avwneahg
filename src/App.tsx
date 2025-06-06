
import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { GameBoard } from './components/GameBoard'
import { GameControls } from './components/GameControls'
import { GameOver } from './components/GameOver'
import { GameStart } from './components/GameStart'

type GameState = 'start' | 'playing' | 'gameover'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [percentageClaimed, setPercentageClaimed] = useState(0)
  
  // Handle level progression
  useEffect(() => {
    if (percentageClaimed >= 75 && gameState === 'playing') {
      // Level complete
      setLevel(prev => prev + 1)
      setScore(prev => prev + 1000) // Bonus for completing level
      setPercentageClaimed(0)
    }
  }, [percentageClaimed, gameState])
  
  // Handle game over
  const handleGameOver = () => {
    if (lives > 1) {
      setLives(prev => prev - 1)
    } else {
      setGameState('gameover')
    }
  }
  
  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setLevel(1)
    setLives(3)
    setPercentageClaimed(0)
  }
  
  const resetGame = () => {
    setGameState('start')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
        Modern Qix
      </h1>
      
      {gameState === 'start' && (
        <GameStart onStart={startGame} />
      )}
      
      {gameState === 'playing' && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                <span className="text-cyan-400 font-bold">Score:</span> 
                <span className="text-white ml-1">{score}</span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                <span className="text-purple-400 font-bold">Level:</span> 
                <span className="text-white ml-1">{level}</span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                <span className="text-pink-400 font-bold">Lives:</span> 
                <span className="text-white ml-1">{lives}</span>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
              <span className="text-yellow-400 font-bold">Territory:</span> 
              <span className="text-white ml-1">{percentageClaimed}%</span>
            </div>
          </div>
          
          <div className="relative">
            <GameBoard 
              level={level} 
              onGameOver={handleGameOver}
              percentageClaimed={percentageClaimed}
            />
            <GameControls />
          </div>
        </div>
      )}
      
      {gameState === 'gameover' && (
        <GameOver 
          score={score} 
          percentageClaimed={percentageClaimed}
          onRestart={resetGame} 
        />
      )}
      
      <div className="mt-8 text-white/60 text-sm">
        Use arrow keys or WASD to move. Hold Shift for fast movement.
      </div>
    </div>
  )
}

export default App