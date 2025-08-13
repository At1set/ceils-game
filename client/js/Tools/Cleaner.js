import Camera from "../Camera/Camera.js"
import InputManager from "../InputManager.js"
import Point from "../utils/Point.js"
import Tool, { States } from "./Tool.js"

export default class Cleaner extends Tool {
  constructor(x = undefined, y = undefined) {
    super()
    this.position = new Point(x, y)
    this.inputManager = InputManager.getInstance()
    this.camera = Camera.getInstance()
  }

  onMouseMove({ worldPos }) {
    this.position = worldPos
  }

  draw(ctx, camera, gridSize) {
    if (this.position.isNull()) return
    if (this.state !== States.itemHover) return

    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    ctx.fillStyle = "red"
    ctx.globalAlpha = 0.6

    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)

    ctx.restore()
  }
}
