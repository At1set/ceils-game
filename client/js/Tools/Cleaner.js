import Camera from "../Camera.js"
import Point from "../utils/Point.js"
import Tool, { States } from "./Tool.js"

export default class Cleaner extends Tool {
  constructor(x = undefined, y = undefined) {
    super()
    this.position = new Point(x, y)
  }

  onMouseMove({ event: e, state }) {
    if (state.isDragging) return
    const camera = Camera.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

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

  delete() {}
}
