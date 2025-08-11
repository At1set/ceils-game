import GameObject from "../GameObjects/GameObject.js"
import InputManager from "../InputManager.js"
import { lerp, Vector2D } from "../Math/index.js"
import Toolbar, { Mods } from "../Toolbar.js"
import GameOptions from "../GameOptions.js"

export default class CameraMovementHandler extends GameObject {
  constructor(camera) {
    super()
    this.camera = camera
    this.inputManager
    this.toolbar

    this.keyboardSensitive_Horizontal = 1
    this.keyboardSensitive_Vertical = 1
    this.mouseSensitive_Horizontal = 0.2895
    this.mouseSensitive_Vertical = 0.2895

    this.movementSpeed = 1000
    this.smoothness = 50

    this.isMoveWithMouse = false
  }

  awake() {
    this.inputManager = InputManager.getInstance()
    this.toolbar = Toolbar.getInstance()
  }

  update(deltaTime) {
    const inputDelta = this.getInputDelta()

    const isCameraStatic =
      (inputDelta.x === 0 && inputDelta.y === 0) ||
      this.toolbar.mode === Mods.drawOnDragging

    if (!isCameraStatic) this.move(deltaTime, inputDelta)
  }

  move(deltaTime, inputDelta) {
    const { camera, movementSpeed, smoothness } = this

    const speed = movementSpeed
    const distance = speed * deltaTime
    const destination = Vector2D.add(
      camera.position,
      inputDelta.multiple(distance)
    )

    camera.position = lerp(camera.position, destination, deltaTime * smoothness)
  }

  getInputDelta() {
    const keyboardInputDelta = this.getKeyboardInputDelta()
    const mouseInputDelta = this.getMouseInputDelta()
    return keyboardInputDelta
      .add(mouseInputDelta)
      .multiple(1 / this.camera.scale)
  }

  getKeyboardInputDelta() {
    const {
      inputManager,
      keyboardSensitive_Horizontal,
      keyboardSensitive_Vertical,
    } = this

    const inputDelta = new Vector2D(
      inputManager.isKeyPressed("a") - inputManager.isKeyPressed("d"),
      inputManager.isKeyPressed("w") - inputManager.isKeyPressed("s")
    ).normalise()

    inputDelta.x *= keyboardSensitive_Horizontal
    inputDelta.y *= keyboardSensitive_Vertical

    return inputDelta
  }

  getMouseInputDelta() {
    const {
      inputManager,
      toolbar,
      mouseSensitive_Horizontal,
      mouseSensitive_Vertical,
    } = this

    if (!this.isMoveWithMouse)
      this.isMoveWithMouse =
        inputManager.mousePositionDelta.len() >=
          GameOptions.cameraMovementStartThreshold &&
        inputManager.isMousePressed() &&
        toolbar.mode !== Mods.drawOnDragging
    if (!this.isMoveWithMouse) return Vector2D.zero()
    this.isMoveWithMouse = inputManager.isMousePressed()

    const inputDelta = inputManager.mousePositionDelta
    inputDelta.x *= mouseSensitive_Horizontal
    inputDelta.y *= mouseSensitive_Vertical

    return inputDelta
  }
}
