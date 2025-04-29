
import { useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

interface GameBoardProps {
  level: number
  onGameOver: () => void
  percentageClaimed: number
}

export function GameBoard({ level, onGameOver }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [boardSize] = useState({ width: 600, height: 400 })
  const [claimedArea, setClaimedArea] = useState<boolean[][]>([])
  const [currentPath, setCurrentPath] = useState<{ x: number, y: number }[]>([])
  const [playerPosition, setPlayerPosition] = useState({ x: 300, y: 399 })
  const [playerDrawing, setPlayerDrawing] = useState(false)
  const [qixPosition, setQixPosition] = useState({ x: 300, y: 200 })
  const [qixVelocity, setQixVelocity] = useState({ x: 2, y: 2 })
  const [sparxPositions, setSparxPositions] = useState<{ x: number, y: number, direction: number }[]>([])
  const [percentageClaimed, setPercentageClaimed] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize the game board
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas with black background
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, boardSize.width, boardSize.height)
    
    // Initialize claimed area (border is claimed)
    const initialClaimedArea = Array(boardSize.height).fill(null).map(() => 
      Array(boardSize.width).fill(false)
    )
    
    // Mark borders as claimed
    for (let x = 0; x < boardSize.width; x++) {
      initialClaimedArea[0][x] = true
      initialClaimedArea[boardSize.height - 1][x] = true
    }
    
    for (let y = 0; y < boardSize.height; y++) {
      initialClaimedArea[y][0] = true
      initialClaimedArea[y][boardSize.width - 1] = true
    }
    
    setClaimedArea(initialClaimedArea)
    
    // Set player at bottom middle
    setPlayerPosition({ x: Math.floor(boardSize.width / 2), y: boardSize.height - 1 })
    
    // Initialize Sparx based on level
    const newSparx = []
    const sparxCount = Math.min(level, 4)
    
    for (let i = 0; i < sparxCount; i++) {
      newSparx.push({
        x: Math.random() > 0.5 ? 0 : boardSize.width - 1,
        y: Math.floor(Math.random() * boardSize.height),
        direction: Math.floor(Math.random() * 4) // 0: up, 1: right, 2: down, 3: left
      })
    }
    
    setSparxPositions(newSparx)
    setIsInitialized(true)
  }, [level, boardSize])
  
  // Keyboard controls
  const { keys } = useKeyboardControls()
  
  // Game loop
  useEffect(() => {
    if (!isInitialized) return
    
    let animationId: number
    let lastTime = 0
    
    const gameLoop = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time
      
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // Clear canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, boardSize.width, boardSize.height)
      
      // Draw grid
      drawGrid(ctx, boardSize.width, boardSize.height)
      
      // Draw claimed area
      ctx.fillStyle = 'rgba(64, 0, 128, 0.5)'
      for (let y = 0; y < boardSize.height; y++) {
        for (let x = 0; x < boardSize.width; x++) {
          if (claimedArea[y] && claimedArea[y][x]) {
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
      
      // Draw current path
      if (currentPath.length > 0) {
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(currentPath[0].x, currentPath[0].y)
        
        for (let i = 1; i < currentPath.length; i++) {
          ctx.lineTo(currentPath[i].x, currentPath[i].y)
        }
        
        ctx.stroke()
      }
      
      // Move player based on keyboard input
      if (!playerDrawing) {
        const speed = keys.shift ? 2 : 1
        let newX = playerPosition.x
        let newY = playerPosition.y
        
        if (keys.up && canMove(playerPosition.x, playerPosition.y - speed)) {
          newY -= speed
        } else if (keys.down && canMove(playerPosition.x, playerPosition.y + speed)) {
          newY += speed
        } else if (keys.left && canMove(playerPosition.x - speed, playerPosition.y)) {
          newX -= speed
        } else if (keys.right && canMove(playerPosition.x + speed, playerPosition.y)) {
          newX += speed
        }
        
        // Start drawing if moved away from border
        if ((newX !== playerPosition.x || newY !== playerPosition.y) && 
            !isOnBorder(newX, newY) && isOnBorder(playerPosition.x, playerPosition.y)) {
          setPlayerDrawing(true)
          setCurrentPath([{ x: playerPosition.x, y: playerPosition.y }])
        }
        
        setPlayerPosition({ x: newX, y: newY })
      } else {
        // Player is drawing
        const speed = keys.shift ? 2 : 1
        let newX = playerPosition.x
        let newY = playerPosition.y
        
        if (keys.up) {
          newY -= speed
        } else if (keys.down) {
          newY += speed
        } else if (keys.left) {
          newX -= speed
        } else if (keys.right) {
          newX += speed
        }
        
        // Check if new position is valid for drawing
        if (newX >= 0 && newX < boardSize.width && newY >= 0 && newY < boardSize.height) {
          // Check if hit border or claimed area
          if (isOnBorder(newX, newY) || 
              (claimedArea[newY] && claimedArea[newY][newX])) {
            // Complete the path
            setCurrentPath([...currentPath, { x: newX, y: newY }])
            
            // Fill the enclosed area
            const newClaimedArea = [...claimedArea]
            const filledArea = calculateArea(currentPath, newClaimedArea, boardSize)
            setClaimedArea(filledArea.newArea)
            
            // Calculate percentage claimed
            const totalClaimed = filledArea.newArea.flat().filter(Boolean).length
            const totalArea = boardSize.width * boardSize.height
            const percentage = Math.floor((totalClaimed / totalArea) * 100)
            setPercentageClaimed(percentage)
            
            // Update game state
            setPlayerDrawing(false)
            setCurrentPath([])
          } else {
            // Continue drawing
            if (newX !== playerPosition.x || newY !== playerPosition.y) {
              setCurrentPath([...currentPath, { x: newX, y: newY }])
            }
          }
          
          setPlayerPosition({ x: newX, y: newY })
        }
      }
      
      // Move Qix
      let newQixX = qixPosition.x + qixVelocity.x
      let newQixY = qixPosition.y + qixVelocity.y
      
      // Bounce off walls and claimed areas
      if (newQixX <= 0 || newQixX >= boardSize.width - 20 || 
          (claimedArea[Math.floor(newQixY)] && claimedArea[Math.floor(newQixY)][Math.floor(newQixX)])) {
        setQixVelocity({ ...qixVelocity, x: -qixVelocity.x })
        newQixX = qixPosition.x - qixVelocity.x
      }
      
      if (newQixY <= 0 || newQixY >= boardSize.height - 20 || 
          (claimedArea[Math.floor(newQixY)] && claimedArea[Math.floor(newQixY)][Math.floor(newQixX)])) {
        setQixVelocity({ ...qixVelocity, y: -qixVelocity.y })
        newQixY = qixPosition.y - qixVelocity.y
      }
      
      setQixPosition({ x: newQixX, y: newQixY })
      
      // Move Sparx along the borders
      const newSparxPositions = sparxPositions.map(sparx => {
        let { x, y, direction } = sparx
        const speed = 1 + Math.floor(level / 3) // Increase speed with level
        
        // Try to move in current direction
        let newX = x
        let newY = y
        
        switch (direction) {
          case 0: // up
            newY -= speed
            break
          case 1: // right
            newX += speed
            break
          case 2: // down
            newY += speed
            break
          case 3: // left
            newX -= speed
            break
        }
        
        // Check if new position is valid (on border or claimed area)
        if (newX >= 0 && newX < boardSize.width && newY >= 0 && newY < boardSize.height &&
            ((isOnBorder(newX, newY) || (claimedArea[newY] && claimedArea[newY][newX])))) {
          return { x: newX, y: newY, direction }
        } else {
          // Change direction
          const newDirection = (direction + 1) % 4
          return { x, y, direction: newDirection }
        }
      })
      
      setSparxPositions(newSparxPositions)
      
      // Check collisions
      // Player with Qix
      if (checkCollision(playerPosition, qixPosition, 10)) {
        handlePlayerDeath()
      }
      
      // Player with Sparx
      for (const sparx of sparxPositions) {
        if (checkCollision(playerPosition, sparx, 5)) {
          handlePlayerDeath()
          break
        }
      }
      
      // Draw entities
      // Draw player
      ctx.fillStyle = '#00ffff'
      ctx.fillRect(playerPosition.x - 2, playerPosition.y - 2, 5, 5)
      
      // Draw Qix
      ctx.fillStyle = '#ff00ff'
      drawQix(ctx, qixPosition.x, qixPosition.y, 20, time / 100)
      
      // Draw Sparx
      ctx.fillStyle = '#ffff00'
      for (const sparx of sparxPositions) {
        ctx.beginPath()
        ctx.arc(sparx.x, sparx.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      
      animationId = requestAnimationFrame(gameLoop)
    }
    
    animationId = requestAnimationFrame(gameLoop)
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isInitialized, keys, playerPosition, playerDrawing, currentPath, claimedArea, 
      qixPosition, qixVelocity, sparxPositions, level, boardSize])
  
  // Helper functions
  function isOnBorder(x: number, y: number): boolean {
    return x === 0 || y === 0 || x === boardSize.width - 1 || y === boardSize.height - 1
  }
  
  function canMove(x: number, y: number): boolean {
    if (x < 0 || x >= boardSize.width || y < 0 || y >= boardSize.height) {
      return false
    }
    
    // Can only move on claimed areas or borders
    return isOnBorder(x, y) || (claimedArea[y] && claimedArea[y][x])
  }
  
  function drawGrid(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    gridSize: number = 20
  ) {
    ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)'
    ctx.lineWidth = 0.5
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }
  
  function drawQix(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
    ctx.save()
    ctx.translate(x, y)
    
    const points = 8
    const innerRadius = size / 3
    const outerRadius = size
    
    ctx.beginPath()
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * 2 * i) / (points * 2) + time / 10
      const pointX = Math.cos(angle) * radius
      const pointY = Math.sin(angle) * radius
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY)
      } else {
        ctx.lineTo(pointX, pointY)
      }
    }
    
    ctx.closePath()
    ctx.fillStyle = `hsl(${(time * 10) % 360}, 100%, 50%)`
    ctx.fill()
    
    ctx.restore()
  }
  
  function checkCollision(
    entity1: { x: number, y: number },
    entity2: { x: number, y: number },
    threshold: number
  ): boolean {
    const dx = entity1.x - entity2.x
    const dy = entity1.y - entity2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    return distance < threshold
  }
  
  function calculateArea(
    path: { x: number, y: number }[],
    currentArea: boolean[][],
    boardSize: { width: number, height: number }
  ): { newArea: boolean[][], filledPoints: number } {
    if (path.length < 3) return { newArea: currentArea, filledPoints: 0 }
    
    // Create a copy of the current area
    const newArea = currentArea.map(row => [...row])
    
    // First, mark the path itself
    for (const point of path) {
      if (point.y >= 0 && point.y < boardSize.height && 
          point.x >= 0 && point.x < boardSize.width) {
        newArea[point.y][point.x] = true
      }
    }
    
    // Flood fill from both sides of the path to determine which side to fill
    const startPoint = path[0]
    const endPoint = path[path.length - 1]
    
    // Find the midpoint of the path
    const midIndex = Math.floor(path.length / 2)
    const midPoint = path[midIndex]
    
    // Determine the direction of the path
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    
    // Find points on both sides of the path
    let leftSideX = midPoint.x - dy
    let leftSideY = midPoint.y + dx
    let rightSideX = midPoint.x + dy
    let rightSideY = midPoint.y - dx
    
    // Ensure the points are within bounds
    leftSideX = Math.max(0, Math.min(boardSize.width - 1, leftSideX))
    leftSideY = Math.max(0, Math.min(boardSize.height - 1, leftSideY))
    rightSideX = Math.max(0, Math.min(boardSize.width - 1, rightSideX))
    rightSideY = Math.max(0, Math.min(boardSize.height - 1, rightSideY))
    
    // Create temporary areas for flood filling
    const leftFill = newArea.map(row => [...row])
    const rightFill = newArea.map(row => [...row])
    
    // Flood fill from both sides
    floodFill(leftFill, Math.floor(leftSideX), Math.floor(leftSideY), boardSize)
    floodFill(rightFill, Math.floor(rightSideX), Math.floor(rightSideY), boardSize)
    
    // Count filled points on both sides
    let leftCount = 0
    let rightCount = 0
    
    for (let y = 0; y < boardSize.height; y++) {
      for (let x = 0; x < boardSize.width; x++) {
        if (leftFill[y][x] && !currentArea[y][x]) leftCount++
        if (rightFill[y][x] && !currentArea[y][x]) rightCount++
      }
    }
    
    // Choose the smaller area to fill (as per Qix rules)
    let filledPoints = 0
    
    if (leftCount <= rightCount && leftCount > 0) {
      // Fill the left side
      for (let y = 0; y < boardSize.height; y++) {
        for (let x = 0; x < boardSize.width; x++) {
          if (leftFill[y][x]) {
            newArea[y][x] = true
            if (!currentArea[y][x]) filledPoints++
          }
        }
      }
    } else if (rightCount > 0) {
      // Fill the right side
      for (let y = 0; y < boardSize.height; y++) {
        for (let x = 0; x < boardSize.width; x++) {
          if (rightFill[y][x]) {
            newArea[y][x] = true
            if (!currentArea[y][x]) filledPoints++
          }
        }
      }
    }
    
    return { newArea, filledPoints }
  }
  
  function floodFill(
    area: boolean[][],
    x: number,
    y: number,
    boardSize: { width: number, height: number }
  ) {
    // Simple stack-based flood fill
    const stack: [number, number][] = [[x, y]]
    const visited: boolean[][] = Array(boardSize.height)
      .fill(null)
      .map(() => Array(boardSize.width).fill(false))
    
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!
      
      // Skip if out of bounds, already visited, or already filled
      if (cx < 0 || cx >= boardSize.width || cy < 0 || cy >= boardSize.height ||
          visited[cy][cx] || area[cy][cx]) {
        continue
      }
      
      // Mark as visited and filled
      visited[cy][cx] = true
      area[cy][cx] = true
      
      // Add neighbors to stack
      stack.push([cx + 1, cy])
      stack.push([cx - 1, cy])
      stack.push([cx, cy + 1])
      stack.push([cx, cy - 1])
    }
  }
  
  function handlePlayerDeath() {
    setPlayerDrawing(false)
    setCurrentPath([])
    setPlayerPosition({ x: Math.floor(boardSize.width / 2), y: boardSize.height - 1 })
    onGameOver()
  }
  
  // Update parent component with percentage claimed
  useEffect(() => {
    if (percentageClaimed > 0) {
      // This would update the parent component
      console.log(`Territory claimed: ${percentageClaimed}%`)
    }
  }, [percentageClaimed])
  
  return (
    <div className="relative border-4 border-cyan-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.5)]">
      <canvas
        ref={canvasRef}
        width={boardSize.width}
        height={boardSize.height}
        className="bg-black"
      />
    </div>
  )
}