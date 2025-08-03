import Block from "./Placement/Block.js"
import Cleaner from "./Tools/Cleaner.js"
import SelectTool from "./Tools/Select.js"
import EventEmitter from "./utils/EventEmitter.js"

let Instance = null

export default class Toolbar extends EventEmitter {
  constructor(toolbar) {
    super()
    if (Instance) return Instance

    this.toolbar = toolbar

    Instance = this
  }

  static getInstance() {
    if (!Instance) throw new Error("Toolbar not initialized yet!")
    return Instance
  }

  setupEventListeners() {
    const { toolbar } = this

    toolbar.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".slot")
      if (!clickedSlot) return
      const allSlots = Array.from(toolbar.querySelectorAll(".slot"))
      allSlots.forEach((slot) => slot.classList.remove("_active"))
      clickedSlot.classList.add("_active")

      if (clickedSlot === allSlots[0]) this.emit("item.switch", new Block())
      else if (clickedSlot === allSlots[1])
        this.emit("tool.switch", new Cleaner())
      else if (clickedSlot === allSlots[2])
        this.emit("tool.switch", new SelectTool())
      else this.emit("item.switch", null)
    })
  }
}
