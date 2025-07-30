import GameObject, { States } from "./GameObject.js"
import Point from "./Point.js"

export default class Player {
  constructor(globals) {
    this.selectedItem = new GameObject()
    this.lastItemCeil = null
    this.globals = globals
  }

  mouseMove(e) {
    const { selectedItem } = this
    const { camera } = this.globals

    if (!selectedItem) return

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    selectedItem.move(worldPos)
    this.updateItemCeil(worldPos)
  }

  updateItemCeil(ceilPosition) {
    const itemCeil = this.globals.gameField.getObjectAt(ceilPosition)
    if (this.lastItemCeil === itemCeil) return
    if (this.lastItemCeil) {
      this.lastItemCeil.itemOver = null
    }
    if (itemCeil) itemCeil.itemOver = this.selectedItem
    this.lastItemCeil = itemCeil
  }

  placeItem(e) {
    const { selectedItem } = this
    const { camera } = this.globals

    if (!selectedItem) return

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    selectedItem.move(worldPos)
    this.globals.gameField.addObject(selectedItem)
    this.selectedItem?.place()
    this.selectedItem = new GameObject(worldPos.x, worldPos.y)
    this.updateItemCeil(worldPos)
  }

  removeItem(e) {
    const { camera, gameField } = this.globals

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    gameField.removeObjectAt(worldPos)
  }
}
