import Point from "./Point.js"

export default class GameObject {
  constructor(x = null, y = null) {
    this.isPlaced = false
    this.position = new Point(x, y)
  }

  place() {
    this.isPlaced = true
  }

  move(point) {
    if (this.isPlaced) return
    this.position = point
  }

  draw(ctx, camera, gridSize) {
    const isDrawPreview = !this.isPlaced
    if (this.position.x === null || this.position.y === null) return

    if (isDrawPreview) ctx.globalAlpha = 0.5
    const posWithOffset = camera.withOffset(this.position)

    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    if (isDrawPreview) ctx.globalAlpha = 1
  }
}
