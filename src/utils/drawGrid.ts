
export function drawGrid(
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