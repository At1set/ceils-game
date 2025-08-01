import Camera from "../Camera.js"
import Tool from "./Tool.js"

export default class SelectTool extends Tool {
  constructor() {
    super()
    this.startPoint = null
    this.endPoint = null
    this.selectedCeils = []
  }

  onMouseMove({ event: e, state }) {
    if (!state.isDragging) return
    const camera = Camera.getInstance()

    const screenpoint = new Point(e.clientX, e.clientY)
    this.endPoint = camera.screenToCeil(screenpoint)
  }

  draw(ctx) {
    if (!this.startPoint || !this.endPoint) return
    const camera = Camera.getInstance()

    const start = camera.withOffset(this.startPoint)
    const end = camera.withOffset(this.endPoint)

    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)

    ctx.save()
    ctx.strokeStyle = "blue"
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x, y, width, height)
    ctx.restore()

    return false
  }
}
