
export function checkCollision(
  entity1: { x: number, y: number },
  entity2: { x: number, y: number },
  threshold: number
): boolean {
  const dx = entity1.x - entity2.x
  const dy = entity1.y - entity2.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  return distance < threshold
}