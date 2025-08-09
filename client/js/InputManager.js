import Vector2D from "./Math/Vector2D.js"
import Point from "./utils/Point.js"

let Instance = null

export default class InputManager {
  constructor() {
    if (Instance) return Instance

    this.pressedKeys = {}
    this.mouse = {
      position: new Point(0, 0),
      _prevPosition: new Point(0, 0),
      left: false,
      right: false,
      middle: false,
    }
    this.mousePositionDelta = Vector2D.zero
    this.startDragPoint = new Point()

    this.#setupKeyboardListeners()
    this.#setupMouseListeners()

    Instance = this
  }

  static getInstance() {
    if (!Instance) throw new Error("InputManager not initialized yet!")
    return Instance
  }

  beforeUpdate() {
    this.mousePositionDelta = Vector2D.from2Points(
      this.mouse._prevPosition,
      this.mouse.position
    )
  }

  afterUpdate() {
    const { x, y } = this.mouse.position
    this.mouse._prevPosition.set(x, y)
  }

  #setupKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      this.pressedKeys[e.key.toLowerCase()] = true
    })

    window.addEventListener("keyup", (e) => {
      this.pressedKeys[e.key.toLowerCase()] = false
    })
  }

  #setupMouseListeners() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.position.set(e.clientX, e.clientY)
    })

    window.addEventListener("mousedown", (e) => {
      this.#setMouseButton(e.button, true)
      this.startDragPoint.set(e.clientX, e.clientY)
    })

    window.addEventListener("mouseup", (e) => {
      this.#setMouseButton(e.button, false)
    })
  }

  #setMouseButton(button, state) {
    switch (button) {
      case 0:
        this.mouse.left = state
        break
      case 1:
        this.mouse.middle = state
        break
      case 2:
        this.mouse.right = state
        break
    }
  }

  isKeyPressed(key) {
    return !!this.pressedKeys[key.toLowerCase()]
  }

  isMousePressed(button = "left") {
    return !!this.mouse[button]
  }

  getMousePosition() {
    return this.mouse.position
  }
}
