import Camera from "../Camera.js"
import GameField from "../GameField.js"
import InputController from "../InputController.js"
import { States } from "../GameObjects/Block.js"
import Point from "../utils/Point.js"
import Tool from "./Tool.js"

export default class SelectTool extends Tool {
  constructor() {
    super()
    this.startDragPoint = new Point()
    this.position = new Point()
    this.selectedCeils = new Set()

    const inputController = InputController.getInstance()

    inputController.on("dragStart", this.handleDragStart)
    inputController.on("dragEnd", this.handleDragEnd)
    inputController.on("keydown", this.handleKeyDown)

    this.delete = () => {
      inputController.off("dragStart", this.handleDragStart)
      inputController.off("dragEnd", this.handleDragEnd)
      inputController.off("keydown", this.handleKeyDown)
      this.unselectItems()
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
    console.log(this.selectedCeils)
  }

  unselectItems() {
    this.selectedCeils.forEach((ceil) => (ceil.state = States.default))
    this.selectedCeils.clear()
  }

  handleKeyDown = (e) => {
    if (e.key === "Delete") this.deleteSelectedItems()
  }

  deleteSelectedItems() {
    if (!this.selectedCeils.size) return
    const gameField = GameField.getInstance()

    this.selectedCeils.forEach((ceil) => {
      gameField.removeObject(ceil)
    })
    this.selectedCeils.clear()
  }

  onMouseMove({ event: e, state }) {
    if (!state.isDragging) return

    this.position.x = e.clientX
    this.position.y = e.clientY
  }

  draw(ctx, camera) {
    if (this.startDragPoint.isNull() || this.position.isNull()) return

    // Переводим в мировые координаты
    const startWorld = camera.screenToWorldAbsolute(this.startDragPoint)
    const endWorld = camera.screenToWorldAbsolute(this.position)

    // Строим всегда от левого верхнего угла
    const x = Math.min(startWorld.x, endWorld.x)
    const y = Math.min(startWorld.y, endWorld.y)
    const width = Math.abs(endWorld.x - startWorld.x)
    const height = Math.abs(endWorld.y - startWorld.y)

    ctx.save()
    ctx.strokeStyle = "#381cf0"
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
  }
}
