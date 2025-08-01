import Camera from "./Camera.js"
import GameField from "./GameField.js"
import GameObject from "./Placement//GameObject.js"
import InputController from "./InputController.js"
import Cleaner from "./Tools/Cleaner.js"
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

    toolbar.on("item.switch", (item) => (this.selectedItem = item))
    toolbar.on("tool.switch", (tool) => (this.selectedTool = tool))
  }

  static getInstance() {
    if (!Instance) throw new Error("Player not initialized yet!")
    return Instance
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

    // Player по-прежнемму остается на текущей клетке
    if (this.lastItemCeil === itemCeil) return

    // Player уходит с блока мышью
    if (this.lastItemCeil) {
      if (this.lastItemCeil.state !== States.selected) {
        this.lastItemCeil.state = States.default
      }
      this.lastItemCeil.drawOptions = null
    }

    // Player перешел мышью на новый блок
    if (itemCeil && itemCeil.state !== States.selected) {
      itemCeil.state = States.itemOver
      if (this.selectedItem instanceof Cleaner) {
        itemCeil.drawOptions =
          this.selectedItem.getDrawOptionsOnItemHover(itemCeil)
      }
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
    this.selectedItem = new GameObject(worldPos.x, worldPos.y)
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
