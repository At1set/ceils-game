import Block from "./GameObjects/Block.js"
import Cleaner from "./Tools/Cleaner.js"
import SelectTool from "./Tools/Select.js"
import EventEmitter from "./utils/EventEmitter.js"

let Instance = null

export const Mods = {
  default: "DEFAULT",
  drawOnDragging: "DRAWONDRAGGING",
}

export default class Toolbar extends EventEmitter {
  constructor(itemsbar, toolbar, modeSwitchingPanel) {
    super()
    if (Instance) return Instance

    this.itemsbar = itemsbar
    this.toolbar = toolbar
    this.modeSwitchingPanel = modeSwitchingPanel

    this.mode = Mods.default

    Instance = this
  }

  static getInstance() {
    if (!Instance) throw new Error("Toolbar not initialized yet!")
    return Instance
  }

  setupEventListeners() {
    const { itemsbar, toolbar, modeSwitchingPanel } = this

    const itemsbar__allSlots = Array.from(
      itemsbar.querySelectorAll(".itemsbar__slot")
    )
    const toolbar__allSlots = Array.from(
      toolbar.querySelectorAll(".toolbar__slot")
    )
    const modeSwitchingPanel__allSlots = Array.from(
      modeSwitchingPanel.querySelectorAll(".modeSwitchingPanel__slot")
    )

    itemsbar__allSlots[0].classList.add("_active")
    modeSwitchingPanel__allSlots[0].classList.add("_active")

    itemsbar.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".itemsbar__slot")
      if (!clickedSlot) return

      const allSlots = itemsbar__allSlots
      const isClickedSlotActive = clickedSlot.classList.contains("_active")
      allSlots.forEach((slot) => slot.classList.remove("_active"))

      // Если нажали на активный слот повторно - делаем его не выбранным
      if (isClickedSlotActive) return this.emit("item.switch", null)

      // Убираем активный слот с toolbar-а (если он есть)
      const toolbar_activeSlot = toolbar__allSlots.filter((slot) =>
        slot.classList.contains("_active")
      )[0]
      if (toolbar_activeSlot) changeTool(toolbar_activeSlot)

      // Привязка конкретным слотам к разным предметам
      if (clickedSlot === allSlots[0]) this.emit("item.switch", new Block())
      else this.emit("item.switch", null)

      clickedSlot.classList.add("_active")
    })

    toolbar.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".toolbar__slot")
      changeTool(clickedSlot)
    })
    const changeTool = (clickedSlot) => {
      if (!clickedSlot) return

      const allSlots = toolbar__allSlots
      const isClickedSlotActive = clickedSlot.classList.contains("_active")
      allSlots.forEach((slot) => slot.classList.remove("_active"))

      // Убираем все активные слоты с itemsbar-а
      itemsbar__allSlots.forEach((slot) => slot.classList.remove("_active"))

      // Если нажали на активный слот повторно - делаем его не выбранным
      if (isClickedSlotActive) {
        this.emit("tool.switch", null)
        return changeMode(modeSwitchingPanel__allSlots[0])
      }

      // Привязка конкретным слотам к разным предметам
      if (clickedSlot === allSlots[0]) this.emit("tool.switch", new Cleaner())
      else if (clickedSlot === allSlots[1]) {
        this.emit("tool.switch", new SelectTool())
        changeMode(modeSwitchingPanel__allSlots[1])
      } else this.emit("tool.switch", null)

      clickedSlot.classList.add("_active")
    }

    modeSwitchingPanel.addEventListener("click", (e) => {
      const clickedSlot = e.target.closest(".modeSwitchingPanel__slot")
      changeMode(clickedSlot)
    })
    const changeMode = (clickedSlot) => {
      if (!clickedSlot) return

      const allSlots = modeSwitchingPanel__allSlots
      const isClickedSlotActive = clickedSlot.classList.contains("_active")
      allSlots.forEach((slot) => slot.classList.remove("_active"))

      // Привязка конкретным слотам к разным предметам
      if (clickedSlot === allSlots[0]) this.mode = Mods.default
      else if (clickedSlot === allSlots[1]) this.mode = Mods.drawOnDragging
      else this.mode = Mods.default

      clickedSlot.classList.add("_active")
    }
  }
}
