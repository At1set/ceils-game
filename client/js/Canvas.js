import Camera from "./Camera.js"
import GameField from "./GameField.js"
import Player from "./Player.js"

let Instance = null

export default class Canvas {
  constructor(canvas, gridSize) {
    if (Instance) return Instance

    this.canvas = canvas
    this.gridSize = gridSize
    this.ctx = canvas.getContext("2d")
    this.height = canvas.height
    this.width = canvas.width
    this.fps = 0

    Instance = this
  }

  static getInstance() {
    if (!Instance) throw new Error("Canvas not initialized yet!")
    return Instance
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
    const scale = Camera.getInstance().scale

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
    const camera = Camera.getInstance()
    const { ctx, width, height, gridSize } = this

    for (let x = camera.position.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.strokeStyle = "#ccc"
      ctx.stroke()
    }

    for (let y = camera.position.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.strokeStyle = "#ccc"
      ctx.stroke()
    }
  }

  drawObjects() {
    const { ctx, gridSize } = this
    const gameField = GameField.getInstance()
    const camera = Camera.getInstance()

    gameField.occupiedCells.forEach((object) =>
      object.draw(ctx, camera, gridSize)
    )
  }

  drawPreview() {
    const { ctx, gridSize } = this
    const player = Player.getInstance()
    const camera = Camera.getInstance()

    if (!player.selectedItem) return
    player.selectedItem.draw(ctx, camera, gridSize)
  }

  drawFPS() {
    const { ctx, width } = this

    ctx.save()
    ctx.resetTransform() // Сброс трансформации, чтобы текст был в экранных координатах
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "gray"
    ctx.textAlign = "right"
    ctx.fillText(`FPS: ${this.fps}`, width - 10, 20)
    ctx.restore()
  }
}
