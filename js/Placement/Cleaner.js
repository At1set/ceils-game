import GameObject from "../GameObject.js"

export default class Cleaner extends GameObject {
  constructor(x, y) {
    super(x, y)
    this.overlapFillStyle = "red"
  }

  draw() {}
}
