import GameObject from "./GameObject.js"

const HoverDrawOptions = {
  fillStyle: "red",
  globalAlpha: 0.6,
}

export default class Cleaner extends GameObject {
  constructor(x, y) {
    super(x, y)
  }

  getDrawOptionsOnItemHover(item) {
    return HoverDrawOptions
  }

  draw() {
    
  }
}
