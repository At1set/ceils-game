export default class Point {
  static {
    Object.setPrototypeOf(this, null)
  }

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Возвращает новую копию текущего объекта
   * @returns Point
   */
  clone() {
    return new Point(this.x, this.y)
  }
}
