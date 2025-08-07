import Point from "../utils/Point.js"
import GameObject from "../GameObjects/GameObject.js"

export const States = {
  default: "DEFAULT",
  itemOnTop: "ITEMONTOP",
  itemHover: "ITEMHOVER",
  selected: "SELECTED",
}

const defaultDrawOptions = {
  default: null,
  preview: {
    globalAlpha: 0.5,
  },
  itemOnTop: null,
  itemHover: {
    globalAlpha: 0.5,
    fillStyle: "lightblue",
    strokeStyle: null,
  },
  selected: {
    globalAlpha: 0.7,
    fillStyle: "lime",
    strokeStyle: "yellow",
  },
}

export default class Block extends GameObject {
  constructor(x = null, y = null) {
    super()
    this.isPlaced = false
    this.position = new Point(x, y)
    this.state = States.default
    this.drawOptions = null
  }

  clone() {
    return new Block(this.position.x, this.position.y)
  }

  place() {
    this.isPlaced = true
  }

  move(point) {
    if (this.isPlaced) return
    this.position = point
  }

  onBlockLeave(block) {
    // console.log("the block:", block, "has leaved from me")
    this.state = States.default
    this.drawOptions = null
  }

  onBlockEnter(block) {
    this.state = States.itemOnTop
    // Тут можно менять например отображение для текущего состояния this.drawOptions
  }

  movedOnNextBlock(from, to) {
    // console.log("entering on the block:", to, "from:", from)
    if (from) from.onBlockLeave(this)
    if (to) to.onBlockEnter(this)
    this.onBlockHover(to)
  }

  onBlockHover(block) {
    // console.log("hovering on the block:", block)
    if (!block) return (this.state = States.default)
    this.state = States.itemHover
  }

  #getDrawOption(type, key) {
    if (type === "default" && this.state === States.itemOnTop)
      return defaultDrawOptions[type]?.[key]
    return this.drawOptions?.[key] ?? defaultDrawOptions[type]?.[key]
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
    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    // Применение стилей
    ctx.fillStyle = this.#getDrawOption("default", "fillStyle")
    ctx.strokeStyle = this.#getDrawOption("default", "strokeStyle")

    // Отрисовка
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)

    ctx.restore()
  }

  drawPreview(ctx, camera, gridSize) {
    ctx.save()

    // Применение стилей
    ctx.globalAlpha = this.#getDrawOption("preview", "globalAlpha")

    // Отрисовка
    this.drawDefault(ctx, camera, gridSize)

    ctx.restore()
  }

  drawItemOnTop(ctx, camera, gridSize) {
    this.drawDefault(ctx, camera, gridSize)
  }

  drawItemHover(ctx, camera, gridSize) {
    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    // Применение стилей
    ctx.fillStyle = this.#getDrawOption("itemHover", "fillStyle")
    ctx.strokeStyle = this.#getDrawOption("itemHover", "strokeStyle")
    ctx.globalAlpha = this.#getDrawOption("itemHover", "globalAlpha")

    // Отрисовка
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)

    ctx.restore()
  }

  drawSelected(ctx, camera, gridSize) {
    this.drawDefault(ctx, camera, gridSize)

    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    // Применение стилей
    ctx.globalAlpha = this.#getDrawOption("selected", "globalAlpha")
    ctx.fillStyle = this.#getDrawOption("selected", "fillStyle")
    ctx.strokeStyle = this.#getDrawOption("selected", "strokeStyle")

    // Отрисовка
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)

    ctx.restore()
  }
}
