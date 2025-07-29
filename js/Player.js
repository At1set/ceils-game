import GameObject from "./GameObject.js"
import Point from "./Point.js"

export default class Player {
  constructor(globals) {
    this.selectedItem = new GameObject()
    this.globals = globals
  }

  onPlace() {
    this.selectedItem?.place()
  }

  mouseMove(e) {
    const { selectedItem } = this
    const { camera } = this.globals

    if (!selectedItem) return

    const mousePoint = new Point(e.clientX, e.clientY)
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    selectedItem.move(worldPos)
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
    this.onPlace()
    this.selectedItem = new GameObject(worldPos.x, worldPos.y)
  }
}
