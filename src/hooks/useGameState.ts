
import { useState, useEffect } from 'react'

type GameState = 'start' | 'playing' | 'gameover'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [percentageClaimed, setPercentageClaimed] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Handle level progression
  useEffect(() => {
    if (percentageClaimed >= 75) {
      // Level complete
      setLevel(prev => prev + 1)
      setScore(prev => prev + 1000) // Bonus for completing level
      setPercentageClaimed(0)
    }
  }, [percentageClaimed])

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      setGameState('gameover')
    }
  }, [gameOver])

  // Handle lives
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true)
    }
  }, [lives])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setLevel(1)
    setLives(3)
    setPercentageClaimed(0)
    setGameOver(false)
  }

  const resetGame = () => {
    setGameState('start')
  }

  return {
    gameState,
    score,
    level,
    lives,
    percentageClaimed,
    startGame,
    resetGame,
    gameOver,
    setGameOver,
    setScore,
    setLives,
    setPercentageClaimed
  }
}