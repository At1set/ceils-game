import GameObject from "../GameObjects/GameObject.js"
import InputManager from "../InputManager.js"
import { lerp, Vector2D } from "../Math/index.js"

export default class CameraMovementHandler extends GameObject {
  constructor(camera) {
    super()
    this.camera = camera
    this.inputManager

    this.keyboardSensitive_Horizontal = 1
    this.keyboardSensitive_Vertical = 1
    this.mouseSensitive_Horizontal = .2895
    this.mouseSensitive_Vertical = .2895

    this.movementSpeed = 1000
    this.smoothness = 50

    this.isMoveWithMouse = false
  }

  awake() {
    this.inputManager = InputManager.getInstance()
  }

  update(deltaTime) {
    const inputDelta = this.getInputDelta()
    this.move(deltaTime, inputDelta)
  }

  move(deltaTime, inputDelta) {
    if (inputDelta.x === 0 && inputDelta.y === 0) return
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
    const { inputManager, mouseSensitive_Horizontal, mouseSensitive_Vertical } =
      this

    if (!this.isMoveWithMouse)
      this.isMoveWithMouse =
        inputManager.mousePositionDelta.len() >= 3 &&
        inputManager.isMousePressed()
    if (!this.isMoveWithMouse) return Vector2D.zero()
    this.isMoveWithMouse = inputManager.isMousePressed()

    const inputDelta = inputManager.mousePositionDelta
    inputDelta.x *= mouseSensitive_Horizontal
    inputDelta.y *= mouseSensitive_Vertical

    return inputDelta
  }
}
