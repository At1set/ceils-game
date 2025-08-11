export const States = {
  default: "DEFAULT",
  itemHover: "ITEMHOVER",
}

export default class Tool {
  constructor() {}

  onMouseDown() {}
  onMouseUp() {}
  onMouseMove() {}
  onKeyDown() {}

  movedOnNextBlock(from, to) {
    this.onBlockHover(to)
  }

  onBlockHover(block) {
    // console.log("hovering on the block:", block)
    if (!block) return (this.state = States.default)
    this.state = States.itemHover
  }

  draw() {}
}
