import Camera from "./Camera.js"
import GameField from "./GameField.js"
import InputController from "./InputController.js"
import Cleaner from "./Tools/Cleaner.js"
import Point from "./utils/Point.js"
import Toolbar from "./Toolbar.js"

let Instance = null

export default class Player {
  constructor(startItem, startTool = null) {
    if (Instance) return Instance

    this.selectedItem = startItem
    this.selectedTool = startTool
    this.lastItemCeil = null

    Instance = this

    const inputController = InputController.getInstance()
    const toolbar = Toolbar.getInstance()

    inputController.on("mouse.move", this.onMouseMove.bind(this))

    inputController.on("player.action", (e) => {
      if (this.selectedTool instanceof Cleaner) this.removeItem(e)
      else this.placeItem(e)
    })

    inputController.on("camera.zoom", this.onMouseMove.bind(this))

    toolbar.on("item.switch", this.setSelectedItem.bind(this))
    toolbar.on("tool.switch", this.setSelectedTool.bind(this))
  }

  static getInstance() {
    if (!Instance) throw new Error("Player not initialized yet!")
    return Instance
  }

  setSelectedItem(item) {
    console.log(item)

    if (!item || !(this.selectedItem instanceof item.constructor)) {
      this.selectedItem = item
      this.selectedTool?.delete?.()
      this.selectedTool = null
    }
  }

  setSelectedTool(tool) {
    console.log(tool)

    if (!tool || !(this.selectedTool instanceof tool.constructor)) {
      this.selectedTool?.delete?.()
      this.selectedTool = tool
      this.selectedItem = null
    }
  }

  onMouseMove(data) {
    const { event: e, state } = data
    const { selectedItem, selectedTool } = this
    selectedTool?.onMouseMove?.(data)
    if (state.isDragging) return

    const camera = Camera.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    selectedItem?.move?.(worldPos)

    this.updateItemCeil(worldPos)
  }

  updateItemCeil(ceilPosition) {
    const gameField = GameField.getInstance()

    const itemCeil = gameField.getObjectAt(ceilPosition)

    // Player по-прежнемму остается на текущей клетке
    if (this.lastItemCeil === itemCeil) return

    // Player уходит с блока мышью на другой блок
    this.selectedTool?.movedOnNextBlock?.(this.lastItemCeil, itemCeil)
    this.selectedItem?.movedOnNextBlock?.(this.lastItemCeil, itemCeil)

    this.lastItemCeil = itemCeil
  }

  placeItem(e) {
    const { selectedItem } = this
    if (!selectedItem) return

    const camera = Camera.getInstance()
    const gameField = GameField.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    selectedItem.move(worldPos)
    const isItemPlaced = gameField.addObject(selectedItem)
    if (!isItemPlaced) return

    this.selectedItem?.place()
    this.selectedItem = this.selectedItem.clone()
    this.updateItemCeil(worldPos)
  }

  removeItem(e) {
    const camera = Camera.getInstance()
    const gameField = GameField.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    gameField.removeObjectAt(worldPos)
    this.updateItemCeil(worldPos)
  }
}
