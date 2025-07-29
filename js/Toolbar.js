import GameObject from "./GameObject.js"

export default class Toolbar {
  constructor(toolbar, globals) {
    this.toolbar = toolbar
    this.globals = globals
  }

  init() {
    const { toolbar } = this

    const slotSize = this.globals.canvas.height / 10
    toolbar.style.width = slotSize + "px"
    Array.from(toolbar.querySelectorAll(".slot")).forEach((slot) => {
      slot.style.width = slotSize - 2.2 + "px"
      slot.style.height = slotSize + "px"
    })

    toolbar.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".slot")
      const allSlots = Array.from(toolbar.querySelectorAll(".slot"))
      allSlots.forEach((slot) => slot.classList.remove("_active"))
      clickedSlot.classList.add("_active")
      if (clickedSlot === allSlots[0])
        this.globals.player.selectedItem = new GameObject()
      else this.globals.player.selectedItem = null
    })
  }
}
