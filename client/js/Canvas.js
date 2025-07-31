export default class Canvas {
  constructor(canvas, globals) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.height = canvas.height
    this.width = canvas.width

    this.globals = globals
  }

  update() {
    this.clear()
    this.applyTransform()
    this.drawGrid()
    this.drawPreview()
    this.drawObjects()
    this.restoreTransform()
    this.drawFPS()
  }

  clear() {
    const { ctx, width, height } = this
    ctx.clearRect(0, 0, width, height)
  }

  applyTransform() {
    const { ctx, canvas } = this
    const scale = this.globals.camera.scale

    const width = canvas.width
    const height = canvas.height

    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(scale, scale)
    ctx.translate(-width / 2, -height / 2)
  }

  restoreTransform() {
    this.ctx.restore()
  }

  drawGrid() {
    const { camera, gridSize } = this.globals
    const { ctx, width, height } = this

    for (let x = camera.offset.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.strokeStyle = "#ccc"
      ctx.stroke()
    }

    for (let y = camera.offset.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.strokeStyle = "#ccc"
      ctx.stroke()
    }
  }

  drawObjects() {
    const { ctx } = this
    const { gameField, camera, gridSize } = this.globals
    gameField.occupiedCells.forEach((object) =>
      object.draw(ctx, camera, gridSize)
    )
  }

  drawPreview() {
    const { ctx } = this
    const { player, camera, gridSize } = this.globals
    if (!player.selectedItem) return
    player.selectedItem.draw(ctx, camera, gridSize)
  }

  drawFPS() {
    const { ctx, width } = this
    const fps = this.globals.fps ?? 0

    ctx.save()
    ctx.resetTransform() // Сброс трансформации, чтобы текст был в экранных координатах
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "gray"
    ctx.textAlign = "right"
    ctx.fillText(`FPS: ${fps}`, width - 10, 20)
    ctx.restore()
  }
}
