import EventEmitter from "./utils/EventEmitter.js"
import Point from "./utils/Point.js"

let Instance = null

export default class InputController extends EventEmitter {
  constructor() {
    super()
    if (Instance) return Instance

    this.state = {
      isDragging: false,
    }

    Instance = this
  }

  static getInstance() {
    if (!Instance) throw new Error("InputController not initialized yet!")
    return Instance
  }

  setupEventListeners(canvas) {
    canvas.addEventListener("mousedown", (e) => {
      this.state.isDragging = true
      const startDragPoint = new Point(e.clientX, e.clientY)
      this.emit("dragStart", startDragPoint)
    })

    window.addEventListener("mouseup", (e) => {
      if (this.state.isDragging) {
        const endDragPoint = new Point(e.clientX, e.clientY)
        this.emit("dragEnd", endDragPoint)
      }
      this.state.isDragging = false
    })

    window.addEventListener("mousemove", (e) => {
      this.emit("mouse.move", { event: e, state: this.state })
    })

    canvas.addEventListener("click", (e) => {
      this.emit("mouse.click", e)
    })

    window.addEventListener("wheel", (e) => {
      this.emit("camera.zoom", { event: e, state: this.state })
    })
  }
}
