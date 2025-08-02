export const States = {
  default: "DEFAULT",
  itemHover: "ITEMHOVER",
}

export default class Tool {
  constructor() {}

  onMouseMove({ event, state }) {
    throw new Error("you should implement method onMouseMove!")
  }

  movedOnNextBlock(from, to) {
    this.onBlockHover(to)
  }

  onBlockHover(block) {
    // console.log("hovering on the block:", block)
    if (!block) return (this.state = States.default)
    this.state = States.itemHover
  }

  draw() {}

  delete() {
    throw new Error("you should implement method delete!")
  }
}
