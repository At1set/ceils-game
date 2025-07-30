import Point from "./Point.js"

export const States = {
  default: "DEFAULT",
  deleteOver: "DELETEOVER",
}

export default class GameObject {
  constructor(x = null, y = null) {
    this.isPlaced = false
    this.position = new Point(x, y)
    this.state = States.default
    this.itemOver = null
    this.overlapFillStyle = "lightblue"
  }

  place() {
    this.isPlaced = true
  }

  move(point) {
    if (this.isPlaced) return
    this.position = point
  }

  draw(ctx, camera, gridSize) {
    const isZeroCoords = this.position.x === null || this.position.y === null
    if (isZeroCoords) return

    const isItemOver = this.isPlaced && this.itemOver
    if (isItemOver) return this.drawItemOver(ctx, camera, gridSize)

    const isDrawDefault = this.isPlaced && this.state === States.default
    if (isDrawDefault) return this.drawDefault(ctx, camera, gridSize)

    return this.drawPreview(ctx, camera, gridSize)
  }

  drawDefault(ctx, camera, gridSize) {
    const posWithOffset = camera.withOffset(this.position)
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
  }

  drawPreview(ctx, camera, gridSize) {
    ctx.globalAlpha = 0.5
    this.drawDefault(ctx, camera, gridSize)
    ctx.globalAlpha = 1
  }

  drawItemOver(ctx, camera, gridSize) {
    this.drawDefault(ctx, camera, gridSize)

    const posWithOffset = camera.withOffset(this.position)
    ctx.save()
    ctx.globalAlpha = 0.5
    ctx.fillStyle = this.itemOver.overlapFillStyle
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.globalAlpha = 1
    ctx.restore()
  }
}
