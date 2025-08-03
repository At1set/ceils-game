import GameObject from "./Placement/GameObject.js"

let Instance = null

export default class GameField {
  constructor() {
    if (Instance) return Instance

    this.occupiedCells = new Map()

    Instance = this
  }

  /**
   *
   * @returns {GameField}
   */
  static getInstance() {
    if (!Instance) throw new Error("GameField not initialized yet!")
    return Instance
  }

  #key(point) {
    return `${point.x},${point.y}`
  }

  hasObjectAt(point) {
    return this.occupiedCells.has(this.#key(point))
  }

  getObjectAt(point) {
    return this.occupiedCells.get(this.#key(point)) || null
  }

  /**
   *
   * @param {GameObject} object
   * @returns {boolean}
   */
  addObject(object) {
    if (this.hasObjectAt(object.position)) return false

    this.occupiedCells.set(this.#key(object.position), object)
    return true
  }

  removeObjectAt(point) {
    return this.occupiedCells.delete(this.#key(point))
  }

  removeObject(object) {
    return this.occupiedCells.delete(this.#key(object.position))
  }

  clear() {
    this.occupiedCells.clear()
  }
}
