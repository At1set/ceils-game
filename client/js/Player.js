import Camera from "./Camera.js"
import GameField from "./GameField.js"
import GameObject from "./Placement//GameObject.js"
import InputController from "./InputController.js"
import Cleaner from "./Placement/Cleaner.js"
import Point from "./utils/Point.js"
import Toolbar from "./Toolbar.js"
import { States } from "./Placement/GameObject.js"

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

    inputController.on("mouse.move", (data) => {
      this.onMouseMove(data)
      this.selectedItem?.onMouseMove?.(data)
    })

    inputController.on("player.action", (e) => {
      if (this.selectedItem instanceof Cleaner) this.removeItem(e)
      else this.placeItem(e)
    })

    toolbar.on("item.switch", this.setSelectedItem.bind(this))
    toolbar.on("tool.switch", this.setSelectedTool.bind(this))
  }

  static getInstance() {
    if (!Instance) throw new Error("Player not initialized yet!")
    return Instance
  }

  setSelectedItem(item) {
    if (!item) this.selectedItem = null

    if (!(this.selectedItem instanceof item.constructor)) {
      this.selectedItem = item
      this.selectedTool = null
    }
  }

  setSelectedTool(tool) {
    if (!tool) this.selectedTool = null

    if (!(this.selectedTool instanceof tool.constructor)) {
      this.selectedTool = tool
    }
  }

  onMouseMove({ event: e, state }) {
    const { selectedItem, selectedTool } = this
    if (!selectedItem || state.isDragging) return

    const camera = Camera.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    selectedItem.move(worldPos)

    if (!selectedTool) this.updateItemCeil(worldPos)
  }

  updateItemCeil(ceilPosition) {
    const gameField = GameField.getInstance()

    const itemCeil = gameField.getObjectAt(ceilPosition)

    // @TODO делегировать логику наведения на новый блок и выход со старого в selectedTool и selectedItem
    // Player по-прежнемму остается на текущей клетке
    if (this.lastItemCeil === itemCeil) return

    // Player уходит с блока мышью
    if (this.lastItemCeil) {
      this.selectedItem?.onBlockLeaving?.(this.lastItemCeil)
    }

    // Player перешел мышью на новый блок
    if (itemCeil && itemCeil.state !== States.selected) {
      this.selectedItem.onEnterOnBlock(itemCeil)
    }
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
    this.selectedItem?.place()
    gameField.addObject(selectedItem)
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
  }
}
