import Camera from "./Camera.js"
import GameField from "./GameField.js"
import GameObject from "./GameObject.js"
import InputController from "./InputController.js"
import Cleaner from "./Placement/Cleaner.js"
import Point from "./utils/Point.js"
import Toolbar from "./Toolbar.js"

let Instance = null

export default class Player {
  constructor() {
    if (Instance) return Instance

    this.selectedItem = new GameObject()
    this.lastItemCeil = null

    Instance = this

    const inputController = InputController.getInstance()
    const toolbar = Toolbar.getInstance()

    inputController.on("player.move", this.mouseMove.bind(this))

    inputController.on("player.action", (e) => {
      if (this.selectedItem instanceof Cleaner) this.removeItem(e)
      else this.placeItem(e)
    })

    toolbar.on("item.switch", (item) => (this.selectedItem = item))
  }

  static getInstance() {
    if (!Instance) throw new Error("Player not initialized yet!")
    return Instance
  }

  mouseMove(e) {
    const { selectedItem } = this
    if (!selectedItem) return

    const camera = Camera.getInstance()

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    selectedItem.move(worldPos)
    this.updateItemCeil(worldPos)
  }

  updateItemCeil(ceilPosition) {
    const gameField = GameField.getInstance()

    const itemCeil = gameField.getObjectAt(ceilPosition)
    if (this.lastItemCeil === itemCeil) return
    if (this.lastItemCeil) {
      this.lastItemCeil.itemOver = null
    }
    if (itemCeil) itemCeil.itemOver = this.selectedItem
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
    gameField.addObject(selectedItem)
    this.selectedItem?.place()
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
