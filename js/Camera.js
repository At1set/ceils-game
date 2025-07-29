import Point from "./Point.js"

export default class Camera {
  constructor(gridSize, startScale, globals) {
    this.scale = startScale
    this.offset = new Point(0, 0)
    this.gridSize = gridSize
    this.globals = globals
  }

  zoom(deltaY) {
    if (deltaY < 0) {
      this.scale = Math.max(1, this.scale - 0.1)
    } else {
      this.scale = Math.min(5, this.scale + 0.1)
    }
  }

  #validatePoint(point) {
    if (!(point instanceof Point))
      throw new Error("point argument must be Point class!")
  }

  /**
   * Получение мировых координат из координат экрана
   * @param {Point} point
   * @returns {Point}
   */
  screenToWorld(point) {
    this.#validatePoint(point)
    const { canvas } = this.globals

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const worldX = (point.x - cx) / this.scale + cx - this.offset.x
    const worldY = (point.y - cy) / this.scale + cy - this.offset.y

    return new Point(worldX, worldY)
  }

  /**
   * Получение координат клетки по экранным координатам
   * @param {Point} point
   * @returns {Point}
   */
  screenToCeil(point) {
    this.#validatePoint(point)
    const worldPoint = this.screenToWorld(point)
    return this.worldToCeil(worldPoint)
  }

  /**
   * Получение координат клетки по мировым координатам
   * @param {Point} point
   * @returns {Point}
   */
  worldToCeil(point) {
    this.#validatePoint(point)
    const ceilX = Math.floor(point.x / this.gridSize)
    const ceilY = Math.floor(point.y / this.gridSize)
    return new Point(ceilX, ceilY)
  }

  /**
   * Преобразование из мировых координат в экранные
   * @param {Point} point
   * @returns {Point}
   */
  worldToScreen(point) {
    this.#validatePoint(point)
    const { canvas } = this.globals

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const screenX = (point.x + this.offset.x - cx) * this.scale + cx
    const screenY = (point.y + this.offset.y - cy) * this.scale + cy

    return new Point(screenX, screenY)
  }

  /**
   * Получение мировых координат из координат клетки
   * @param {Point} point
   * @returns {Point}
   */
  ceilToWorld(point) {
    this.#validatePoint(point)
    const worldX = point.x * this.gridSize
    const worldY = point.y * this.gridSize
    return new Point(worldX, worldY)
  }

  /**
   * Получение экранных координат из координат клетки
   * @param {Point} point
   * @returns {Point}
   */
  ceilToScreen(point) {
    this.#validatePoint(point)
    const worldPoint = this.ceilToWorld(point)
    return this.worldToScreen(worldPoint)
  }

  withOffset(point) {
    return new Point(point.x + this.offset.x, point.y + this.offset.y)
  }
}
