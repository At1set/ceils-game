import Camera from "./Camera/Camera.js"
import GameField from "./GameField.js"
import GameOptions from "./GameOptions.js"
import Player from "./Player.js"

let Instance = null

/**
 * Выполняет роль отрисовки графики игры
 */
export default class Canvas {
  constructor(canvas) {
    if (Instance) return Instance

    this.canvas = canvas
    this.gridSize = GameOptions.gridSize
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

  /**
   * Отрисовать кадр игры
   */
  render() {
    this.clear()
    this.applyTransform()

    this.drawGrid()
    this.drawObjects()
    this.drawSelectedItem()
    this.drawSelectedTool()

    this.restoreTransform()

    this.drawFPS()
  }

  /**
   * Очистить канвас
   */
  clear() {
    const { ctx, width, height } = this
    ctx.clearRect(0, 0, width, height)
  }

  /**
   * Применить приближение камеры к канвасу
   */
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

  /**
   * Восстанавливает настройки канваса после приближения камеры
   */
  restoreTransform() {
    this.ctx.restore()
  }

  /**
   * Отрисовка игровой сетки
   */
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

  /**
   * Отрисовка всех объектов, установленных на поле
   */
  drawObjects() {
    const { ctx, gridSize } = this
    const gameField = GameField.getInstance()
    const camera = Camera.getInstance()

    gameField.occupiedCells.forEach((object) =>
      object.draw(ctx, camera, gridSize)
    )
  }

  /**
   * Отрисовка выбранного предмета у Player
   */
  drawSelectedItem() {
    const player = Player.getInstance()
    if (!player.selectedItem) return

    const { ctx, gridSize } = this
    const camera = Camera.getInstance()
    player.selectedItem.draw(ctx, camera, gridSize)
  }

  drawSelectedTool() {
    const player = Player.getInstance()
    if (!player.selectedTool) return

    const { ctx, gridSize } = this
    const camera = Camera.getInstance()
    return player.selectedTool.draw(ctx, camera, gridSize)
  }

  /**
   * Отрисовка фпс
   */
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
