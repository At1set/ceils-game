import Canvas from "./Canvas.js"
import InputController from "./InputController.js"
import Point from "./utils/Point.js"

let Instance = null

/**
 * Отвечает за положение видимой части игрового поля на экране, а также за зум.
 *
 * Имеет методы, необходимые для получения координат игрового поля
 */
export default class Camera {
  /**
   * Создает/возвращает объект камеры
   * @param {number} startScale Начальный зум
   * @returns {Camera}
   */

  constructor(startScale) {
    if (Instance) return Instance

    this.scale = startScale
    this.position = new Point(0, 0)
    this.lastPosition = new Point()
    this.startDragPoint = new Point()

    this.targetScale = startScale
    this.minScale = 1
    this.maxScale = 5
    this.zoomSpeed = 0.0015
    this.zoomSmoothing = 0.05 // Чем меньше, тем медленнее/плавнее

    Instance = this

    const inputController = InputController.getInstance()

    inputController.on("dragStart", (point) => {
      this.startDragPoint = point
      this.lastPosition = this.position.clone()
    })

    inputController.on("camera.dragging", (e) => {
      const dx = e.clientX - this.startDragPoint.x
      const dy = e.clientY - this.startDragPoint.y

      this.position.x = this.lastPosition.x + dx / this.scale
      this.position.y = this.lastPosition.y + dy / this.scale
    })

    inputController.on("camera.zoom", ({ event }) => this.zoom(event.deltaY))
  }

  static getInstance() {
    if (!Instance) throw new Error("Camera not initialized yet!")
    return Instance
  }

  /**
   * Изменение зума камеры при прокрутке колесика
   * @param {number} deltaY
   */
  zoom(deltaY) {
    const direction = Math.sign(deltaY)
    const zoomFactor = 1 - direction * this.zoomSpeed * Math.abs(deltaY)

    this.targetScale *= zoomFactor
    this.targetScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, this.targetScale)
    )
  }

  update() {
    // Плавное приближение
    this.scale += (this.targetScale - this.scale) * this.zoomSmoothing    
  }

  #validatePoint(point) {
    if (!(point instanceof Point))
      throw new Error("point argument must be Point class!")
  }

  /**
   * Получение мировых координат из координат на экране
   * @param {Point} point screenpoint
   * @returns {Point} worldpoint
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
   * Получение абсолютных мировых координат (без учета смещения камеры) из координат на экране
   * @param {Point} point screenpoint
   * @returns {Point} absolute worldpoint
   */
  screenToWorldAbsolute(point) {
    this.#validatePoint(point)
    const canvas = Canvas.getInstance()

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const worldX = (point.x - cx) / this.scale + cx
    const worldY = (point.y - cy) / this.scale + cy

    return new Point(worldX, worldY)
  }

  /**
   * Получение координат клетки по экранным координатам
   * @param {Point} point screenpoint
   * @returns {Point} gridpoint
   */
  screenToCeil(point) {
    this.#validatePoint(point)
    const worldPoint = this.screenToWorld(point)
    return this.worldToCeil(worldPoint)
  }

  /**
   * Получение координат клетки по мировым координатам
   * @param {Point} point worldpoint
   * @returns {Point} gridpoint
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
   * @param {Point} point worldpoint
   * @returns {Point} screenpoint
   * @deprecated Метод не нужен из-за неправильной работы.
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
   * @param {Point} point gridpoint
   * @returns {Point} worldpoint
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
   * @param {Point} point gridpoint
   * @returns {Point} screenpoint
   * @deprecated Метод не нужен из-за неправильной работы.
   */
  ceilToScreen(point) {
    this.#validatePoint(point)
    const worldPoint = this.ceilToWorld(point)
    return this.worldToScreen(worldPoint)
  }

  /**
   * Получение абсолютных мировых координат, исключая позицию камеры
   * @param {Point} point worldpoint
   * @returns {Point} worldpoint
   */
  withOffset(point) {
    return new Point(point.x + this.position.x, point.y + this.position.y)
  }
}
