import Vector2D from "./Math/Vector2D.js"
import Point from "./utils/Point.js"

let Instance = null

export default class InputManager {
  constructor() {
    if (Instance) return Instance

    this.pressedKeys = {}
    this._prevPressedKeys = {}

    this.mouse = {
      position: new Point(0, 0),
      left: false,
      right: false,
      middle: false,
      deltaY: 0,
    }
    this._prevMouse = {
      ...this.mouse,
    }

    this.mousePositionDelta = Vector2D.zero()
    this.mouseDraggingDelta = Vector2D.zero()
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
      this._prevMouse.position,
      this.mouse.position
    )
  }

  afterUpdate() {
    this._prevMouse = {
      ...this.mouse,
      position: this.mouse.position.clone(),
    }
    this.mouse.deltaY = 0

    this._prevPressedKeys = {
      ...this.pressedKeys,
    }
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
      if (!e.target.closest("#root")) return

      this.#setMouseButton(e.button, true)
      this.startDragPoint.set(e.clientX, e.clientY)
      this.mouseDraggingDelta.set(0, 0)
    })

    window.addEventListener("mouseup", (e) => {
      this.#setMouseButton(e.button, false)
      this.mouseDraggingDelta = Vector2D.from2Points(
        this.startDragPoint,
        this.mouse.position
      )
    })

    window.addEventListener("wheel", (e) => {
      this.mouse.deltaY = e.deltaY
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

  // Проверка: клавиша нажата прямо в этом кадре
  isKeyDown(key) {
    key = key.toLowerCase()
    return this.pressedKeys[key] && !this._prevPressedKeys[key]
  }

  // Проверка: клавиша отпущена прямо в этом кадре
  isKeyUp(key) {
    key = key.toLowerCase()
    return !this.pressedKeys[key] && this._prevPressedKeys[key]
  }

  // Проверка: кнопка мыши нажата в этом кадре
  isMouseDown(button = "left") {
    return this.mouse[button] && !this._prevMouse[button]
  }

  // Проверка: кнопка мыши отпущена в этом кадре
  isMouseUp(button = "left") {
    return !this.mouse[button] && this._prevMouse[button]
  }

  isKeyPressed(key) {
    key = key.toLowerCase()
    return !!this.pressedKeys[key.toLowerCase()]
  }

  isMousePressed(button = "left") {
    return !!this.mouse[button]
  }

  getMousePosition() {
    return this.mouse.position
  }

  getMouseScrollDelta() {
    return this.mouse.deltaY
  }
}
