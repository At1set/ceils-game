import Point from "../utils/Point.js"

export default class Vector2D extends Point {
  constructor(x, y) {
    super(x, y)
  }

  static from2Points(startPoint, endPoint) {
    return new Vector2D(endPoint.x - startPoint.x, endPoint.y - startPoint.y)
  }

  static add(vector1, vector2) {
    return new Vector2D(vector1.x + vector2.x, vector1.y + vector2.y)
  }

  static minus(vector1, vector2) {
    return new Vector2D(vector1.x - vector2.x, vector1.y - vector2.y)
  }

  static zero() {
    return new Vector2D(0, 0)
  }

  static top() {
    return new Vector2D(0, 1)
  }

  static right() {
    return new Vector2D(1, 0)
  }

  static bottom() {
    return new Vector2D(0, -1)
  }

  static left() {
    return new Vector2D(-1, 0)
  }

  static topRight() {
    return new Vector2D(1, 1).normalise()
  }

  static bottomRight() {
    return new Vector2D(1, -1).normalise()
  }

  static bottomLeft() {
    return new Vector2D(-1, -1).normalise()
  }

  static topLeft() {
    return new Vector2D(-1, 1).normalise()
  }

  clone() {
    return new Vector2D(this.x, this.y)
  }

  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  add(vector2D) {
    if (!(vector2D instanceof Point))
      throw new Error("Argument vector2D must be instance of class Point!")

    this.x += vector2D.x
    this.y += vector2D.y
    return this
  }

  minus(vector2D) {
    if (!(vector2D instanceof Point))
      throw new Error("Argument vector2D must be instance of class Point!")

    this.y -= vector2D.y
    this.x -= vector2D.x
    return this
  }

  multiple(scalar) {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  normalise() {
    const length = this.len()
    if (length === 0) return this
    this.x /= length
    this.y /= length
    return this
  }

  normalised() {
    const length = this.len()
    if (length === 0) return this
    return new Vector2D(this.x / length, this.y / length)
  }
}
