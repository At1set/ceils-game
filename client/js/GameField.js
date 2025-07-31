import GameObject from "./GameObject.js"

export default class GameField {
  constructor() {
    this.occupiedCells = new Map()
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

  clear() {
    this.occupiedCells.clear()
  }
}
