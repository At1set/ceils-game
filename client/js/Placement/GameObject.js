import Point from "/client/js/utils/Point.js"

export const States = {
  default: "DEFAULT",
  itemOnTop: "ITEMONTOP",
  itemHover: "ITEMHOVER",
  selected: "SELECTED",
}

export default class GameObject {
  constructor(x = undefined, y = undefined) {
    this.isPlaced = false
    this.position = new Point(x, y)
    this.state = States.default
    this.drawOptions = null
  }

  place() {
    this.isPlaced = true
  }

  clone() {}

  onBlockLeaving(block) {
    block.state = States.default
    block.drawOptions = null
  }

  onEnterOnBlock(block) {
    block.onBlockHover(block)
    this.state = States.itemHover
  }

  onBlockHover(block) {
    this.state = States.itemOnTop
  }

  move(point) {
    if (this.isPlaced) return
    this.position = point
  }

  draw(ctx, camera, gridSize) {
    if (this.position.isNull()) return

    const isSelected = this.isPlaced && this.state === States.selected
    if (isSelected) return this.drawSelected(ctx, camera, gridSize)

    const isItemOnTop = this.isPlaced && this.state === States.itemOnTop
    if (isItemOnTop) return this.drawItemOnTop(ctx, camera, gridSize)

    const isDrawDefault = this.isPlaced && this.state === States.default
    if (isDrawDefault) return this.drawDefault(ctx, camera, gridSize)

    const isItemHover = !this.isPlaced && this.state === States.itemHover
    if (isItemHover) return this.drawItemHover(ctx, camera, gridSize)

    return this.drawPreview(ctx, camera, gridSize)
  }

  drawDefault(ctx, camera, gridSize) {
    throw new Error("you should implement method drawDefault!")
  }

  drawPreview(ctx, camera, gridSize) {
    throw new Error("you should implement method drawPreview!")
  }

  drawItemOnTop(ctx, camera, gridSize) {
    throw new Error("you should implement method drawItemOnTop!")
  }

  drawItemHover(ctx, camera, gridSize) {
    throw new Error("you should implement method drawItemHover!")
  }

  drawSelected(ctx, camera, gridSize) {
    throw new Error("you should implement method drawSelected!")
  }
}
