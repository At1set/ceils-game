import Camera from "../Camera/Camera.js"
import GameField from "../GameField.js"
import { States } from "../GameObjects/Block.js"
import Point from "../utils/Point.js"
import Tool from "./Tool.js"

export default class SelectTool extends Tool {
  constructor() {
    super()
    this.startDragPoint = new Point()
    this.position = new Point()
    this.selectedCeils = new Set()
  }

  onMouseDown({ screenPoint }) {
    this.startDragPoint.set(screenPoint.x, screenPoint.y)
  }

  onMouseUp() {
    this.selectItems()
    this.startDragPoint.set(null, null)
    this.position.set(null, null)
  }

  onMouseMove({ screenPoint, isDragging }) {
    if (!isDragging) return
    this.position.set(screenPoint.x, screenPoint.y)
  }

  onKeyDown(e) {
    if (e.key === "delete") this.deleteSelectedItems()
  }

  delete() {
    this.unselectItems()
  }

  selectItems() {
    if (this.startDragPoint.isNull() || this.position.isNull()) return

    const camera = Camera.getInstance()
    const gameField = GameField.getInstance()

    const startCeil = camera.screenToCeil(this.startDragPoint)
    const endCeil = camera.screenToCeil(this.position)

    const xStart = Math.min(startCeil.x, endCeil.x)
    const xEnd = Math.max(startCeil.x, endCeil.x)
    const yStart = Math.min(startCeil.y, endCeil.y)
    const yEnd = Math.max(startCeil.y, endCeil.y)

    const selectedCeils = []

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        const worldPos = camera.ceilToWorld(new Point(x, y))
        const ceil = gameField.getObjectAt(worldPos)
        if (ceil) selectedCeils.push(ceil)
      }
    }

    if (!selectedCeils.length) this.unselectItems()

    selectedCeils.forEach((ceil) => {
      ceil.state = States.selected
      this.selectedCeils.add(ceil)
    })
  }

  unselectItems() {
    this.selectedCeils.forEach((ceil) => (ceil.state = States.default))
    this.selectedCeils.clear()
  }

  deleteSelectedItems() {
    if (!this.selectedCeils.size) return
    const gameField = GameField.getInstance()

    this.selectedCeils.forEach((ceil) => {
      gameField.removeObject(ceil)
    })
    this.selectedCeils.clear()
  }

  draw(ctx, camera) {
    if (this.startDragPoint.isNull() || this.position.isNull()) return

    const startWorld = camera.screenToWorldAbsolute(this.startDragPoint)
    const endWorld = camera.screenToWorldAbsolute(this.position)

    const x = Math.min(startWorld.x, endWorld.x)
    const y = Math.min(startWorld.y, endWorld.y)
    const width = Math.abs(endWorld.x - startWorld.x)
    const height = Math.abs(endWorld.y - startWorld.y)

    ctx.save()
    ctx.strokeStyle = "#381cf0"
    ctx.lineWidth = 4 / camera.scale
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
  }
}
