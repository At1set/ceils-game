import Canvas from "./Canvas.js"
import GameObject from "./GameObject.js"
import Cleaner from "./Placement/Cleaner.js"
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

    const slotSize = Canvas.getInstance().canvas.height / 10
    toolbar.style.width = slotSize + "px"
    Array.from(toolbar.querySelectorAll(".slot")).forEach((slot) => {
      slot.style.width = slotSize - 2.2 + "px"
      slot.style.height = slotSize + "px"
    })

    toolbar.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".slot")
      if (!clickedSlot) return
      const allSlots = Array.from(toolbar.querySelectorAll(".slot"))
      allSlots.forEach((slot) => slot.classList.remove("_active"))
      clickedSlot.classList.add("_active")
      if (clickedSlot === allSlots[0])
        this.emit("item.switch", new GameObject())
      else if (clickedSlot === allSlots[1])
        this.emit("item.switch", new Cleaner())
      else this.emit("item.switch", null)
    })
  }
}
