import Camera from "../Camera.js"
import GameField from "../GameField.js"
import InputController from "../InputController.js"
import { States } from "../Placement/GameObject.js"
import Point from "../utils/Point.js"
import Tool from "./Tool.js"

export default class SelectTool extends Tool {
  constructor() {
    super()
    this.startDragPoint = new Point()
    this.position = new Point()
    this.selectedCeils = []

    const inputController = InputController.getInstance()

    inputController.on("dragStart", this.handleDragStart)
    inputController.on("dragEnd", this.handleDragEnd)

    this.delete = () => {
      inputController.off("dragStart", this.handleDragStart)
      inputController.off("dragEnd", this.handleDragEnd)
    }
  }

  handleDragStart = (point) => {
    this.startDragPoint = point
  }

  handleDragEnd = (point) => {
    this.selectItems()
    this.startDragPoint.set(null, null)
    this.position.set(null, null)
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

    const selected = []

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        const ceil = gameField.getObjectAt(new Point(x, y))
        if (ceil) {
          selected.push(ceil)
          ceil.state = States.selected
        }
      }
    }

    console.log(selected)
    this.selectedCeils = selected
  }

  onMouseMove({ event: e, state }) {
    if (!state.isDragging) return

    this.position.x = e.clientX
    this.position.y = e.clientY
  }

  draw(ctx, camera) {
    if (this.startDragPoint.isNull() || this.position.isNull()) return

    // Переводим в мировые координаты
    const startWorld = camera.withOffset(
      camera.screenToWorld(this.startDragPoint)
    )
    const endWorld = camera.withOffset(camera.screenToWorld(this.position))

    // Строим всегда от левого верхнего угла
    const x = Math.min(startWorld.x, endWorld.x)
    const y = Math.min(startWorld.y, endWorld.y)
    const width = Math.abs(endWorld.x - startWorld.x)
    const height = Math.abs(endWorld.y - startWorld.y)

    ctx.save()
    ctx.strokeStyle = "blue"
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
  }
}
