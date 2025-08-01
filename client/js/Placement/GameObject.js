import Point from "/client/js/utils/Point.js"

export const States = {
  default: "DEFAULT",
  itemOver: "ITEMOVER",
  selected: "SELECTED",
}

const defaultDrawOptions = {
  default: {
    fillStyle: null,
    strokeStyle: null,
  },
  preview: {
    globalAlpha: 0.5,
  },
  itemOver: {
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

export default class GameObject {
  constructor(x = null, y = null) {
    this.isPlaced = false
    this.position = new Point(x, y)
    this.state = States.default
    this.drawOptions = null
  }

  place() {
    this.isPlaced = true
  }

  move(point) {
    if (this.isPlaced) return
    this.position = point
  }

  #getDrawOption(type, key) {
    if (type === "default" && this.state === States.itemOver)
      return defaultDrawOptions[type]?.[key]
    return this.drawOptions?.[key] ?? defaultDrawOptions[type]?.[key]
  }

  draw(ctx, camera, gridSize) {
    if (this.position.isNull()) return

    const isSelected = this.isPlaced && this.state === States.selected
    if (isSelected) return this.drawSelected(ctx, camera, gridSize)

    const isItemOver = this.isPlaced && this.state === States.itemOver
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

  drawItemOver(ctx, camera, gridSize) {
    this.drawDefault(ctx, camera, gridSize)

    ctx.save()
    const posWithOffset = camera.withOffset(this.position)

    // Применение стилей
    ctx.globalAlpha = this.#getDrawOption("itemOver", "globalAlpha")
    ctx.fillStyle = this.#getDrawOption("itemOver", "fillStyle")
    ctx.strokeStyle = this.#getDrawOption("itemOver", "strokeStyle")

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
