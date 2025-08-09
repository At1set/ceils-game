export default class Point {
  static {
    Object.setPrototypeOf(this, null)
  }

  constructor(x = null, y = null) {
    this.x = x
    this.y = y
  }

  static add(point1, point2) {
    return new Point(point1.x + point2.x, point1.y + point2.y)
  }

  static minus(point1, point2) {
    return new Point(point1.x - point2.x, point1.y - point2.y)
  }

  multiple(value) {
    this.x *= value
    this.y *= value
    return this
  }

  /**
   * Возвращает новую копию текущего объекта
   * @returns {Point}
   */
  clone() {
    return new Point(this.x, this.y)
  }

  /**
   * Сравнивает координаты текущего объекта с переданным point
   * @param {Point} point
   * @returns {boolean}
   */
  equals(point) {
    return this.x === point.x && this.y === point.y
  }

  /**
   * Проверяет, есть ли нулевая координата
   * @returns {boolean}
   */
  isNull() {
    return this.x === null || this.y === null
  }

  set(x, y) {
    this.x = x
    this.y = y
  }
}
