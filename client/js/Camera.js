import Canvas from "./Canvas.js"
import InputController from "./InputController.js"
import Point from "./utils/Point.js"

let Instance = null

export default class Camera {
  constructor(startScale) {
    if (Instance) return Instance

    this.scale = startScale
    this.position = new Point(0, 0)
    this.lastPosition = new Point()
    this.startDragPoint = new Point()

    Instance = this

    const inputController = InputController.getInstance()

    inputController.on("camera.dragStart", (point) => {
      this.startDragPoint = point
      this.lastPosition = this.position.clone()
    })

    inputController.on("camera.dragging", (e) => {
      const dx = e.clientX - this.startDragPoint.x
      const dy = e.clientY - this.startDragPoint.y

      this.position.x = this.lastPosition.x + dx / this.scale
      this.position.y = this.lastPosition.y + dy / this.scale
    })

    inputController.on("camera.zoom", this.zoom.bind(this))
  }

  static getInstance() {
    if (!Instance) throw new Error("Camera not initialized yet!")
    return Instance
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
    const canvas = Canvas.getInstance()

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const worldX = (point.x - cx) / this.scale + cx - this.position.x
    const worldY = (point.y - cy) / this.scale + cy - this.position.y

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
    const gridSize = Canvas.getInstance().gridSize

    this.#validatePoint(point)
    const ceilX = Math.floor(point.x / gridSize)
    const ceilY = Math.floor(point.y / gridSize)
    return new Point(ceilX, ceilY)
  }

  /**
   * Преобразование из мировых координат в экранные
   * @param {Point} point
   * @returns {Point}
   */
  worldToScreen(point) {
    this.#validatePoint(point)
    const canvas = Canvas.getInstance()

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const screenX = (point.x + this.position.x - cx) * this.scale + cx
    const screenY = (point.y + this.position.y - cy) * this.scale + cy

    return new Point(screenX, screenY)
  }

  /**
   * Получение мировых координат из координат клетки
   * @param {Point} point
   * @returns {Point}
   */
  ceilToWorld(point) {
    const gridSize = Canvas.getInstance().gridSize

    this.#validatePoint(point)
    const worldX = point.x * gridSize
    const worldY = point.y * gridSize
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
    return new Point(point.x + this.position.x, point.y + this.position.y)
  }
}
