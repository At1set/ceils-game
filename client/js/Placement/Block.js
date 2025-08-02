import Point from "/client/js/utils/Point.js"
import GameObject, { States } from "./GameObject.js"

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
    super(x, y)
    this.isPlaced = false
    this.position = new Point(x, y)
    this.state = States.default
    this.drawOptions = null
  }

  clone() {
    return new Block(this.position.x, this.position.y)
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

    const isItemOver = this.isPlaced && this.state === States.itemOnTop
    if (isItemOver) return this.drawItemOver(ctx, camera, gridSize)

    const isDrawDefault = this.isPlaced && this.state === States.default
    if (isDrawDefault) return this.drawDefault(ctx, camera, gridSize)

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

    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    // Применение стилей
    ctx.globalAlpha = this.#getDrawOption("itemOnTop", "globalAlpha")
    ctx.fillStyle = this.#getDrawOption("itemOnTop", "fillStyle")
    ctx.strokeStyle = this.#getDrawOption("itemOnTop", "strokeStyle")

    // Отрисовка
    ctx.fillRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)
    ctx.strokeRect(posWithOffset.x, posWithOffset.y, gridSize, gridSize)

    ctx.restore()
  }

  drawItemHover(ctx, camera, gridSize) {
    
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
