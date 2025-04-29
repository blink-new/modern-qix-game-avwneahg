
export function calculateArea(
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