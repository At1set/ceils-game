import Camera from "./Camera/Camera.js"
import GameField from "./GameField.js"
import Toolbar, { Mods } from "./Toolbar.js"
import GameObject from "./GameObjects/GameObject.js"
import InputManager from "./InputManager.js"
import Cleaner from "./Tools/Cleaner.js"
import GameOptions from "./GameOptions.js"

let Instance = null

export default class Player extends GameObject {
  constructor(startItem, startTool = null) {
    super()
    if (Instance) return Instance

    this.inputManager
    this.camera
    this.gameField
    this.toolbar

    this.selectedItem = startItem
    this.selectedTool = startTool
    this.lastItemCeil = null

    Instance = this

    const toolbar = Toolbar.getInstance()
    this.toolbar = toolbar

    toolbar.on("item.switch", this.setSelectedItem.bind(this))
    toolbar.on("tool.switch", this.setSelectedTool.bind(this))
  }

  static getInstance() {
    if (!Instance) throw new Error("Player not initialized yet!")
    return Instance
  }

  awake() {
    this.inputManager = InputManager.getInstance()
    this.camera = Camera.getInstance()
    this.gameField = GameField.getInstance()
  }

  setSelectedItem(item) {
    console.log(item)

    if (!item || !(this.selectedItem instanceof item.constructor)) {
      this.selectedTool?.delete?.()
      this.selectedItem = item
      this.selectedTool = null
    }
  }

  setSelectedTool(tool) {
    console.log(tool)

    if (!tool || !(this.selectedTool instanceof tool.constructor)) {
      this.selectedTool?.delete?.()
      this.selectedTool = tool
      this.selectedItem = null
    }
  }

  update() {
    const { inputManager, selectedTool, selectedItem, camera } = this

    const screenPoint = inputManager.getMousePosition()
    const ceilPos = camera.screenToCeil(screenPoint)
    const worldPos = camera.ceilToWorld(ceilPos)
    const isDragging = inputManager.isMousePressed()
    const isMouseMoved = inputManager.mousePositionDelta.len() > 0
    const mouseScrollDelta = inputManager.getMouseScrollDelta()

    const mouseInputData = {
      screenPoint,
      ceilPos,
      worldPos,
      isDragging,
      isMouseMoved,
    }

    if (inputManager.isMouseDown()) {
      selectedTool?.onMouseDown?.(mouseInputData)
    }
    if (inputManager.isMouseUp()) {
      selectedTool?.onMouseUp?.(mouseInputData)
      if (
        inputManager.mouseDraggingDelta.len() <
        GameOptions.cameraMovementStartThreshold
      )
        this.doAction()
    }
    if (isMouseMoved || mouseScrollDelta) {
      selectedTool?.onMouseMove?.(mouseInputData)
      selectedItem?.move(worldPos)
      if (
        this.toolbar.mode === Mods.drawOnDragging &&
        inputManager.isMousePressed()
      )
        this.doAction()
      else this.updateItemCeil(worldPos)
    }

    for (let key in inputManager.pressedKeys) {
      if (inputManager.isKeyDown(key)) {
        selectedTool?.onKeyDown?.({ key })
      }
    }
  }

  doAction() {
    const { selectedItem, selectedTool } = this
    if (selectedTool instanceof Cleaner) this.removeItem()
    else if (selectedItem) this.placeItem()
  }

  updateItemCeil(worldPos) {
    const { gameField } = this

    const itemCeil = gameField.getObjectAt(worldPos)

    // Player по-прежнемму остается на текущей клетке
    if (this.lastItemCeil === itemCeil) return

    // Player уходит с блока мышью на другой блок
    this.selectedTool?.movedOnNextBlock?.(this.lastItemCeil, itemCeil)
    this.selectedItem?.movedOnNextBlock?.(this.lastItemCeil, itemCeil)

    this.lastItemCeil = itemCeil
  }

  placeItem() {
    const { selectedItem, inputManager, camera, gameField } = this

    const mousePoint = inputManager.getMousePosition()
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    selectedItem.move(worldPos)
    const isItemPlaced = gameField.addObject(selectedItem)
    if (!isItemPlaced) return

    selectedItem?.place()
    this.selectedItem = selectedItem.clone()
    this.updateItemCeil(worldPos)
  }

  removeItem() {
    const { inputManager, camera, gameField } = this

    const mousePoint = inputManager.getMousePosition()
    const ceilPos = camera.screenToCeil(mousePoint)
    const worldPos = camera.ceilToWorld(ceilPos)

    gameField.removeObjectAt(worldPos)
    this.updateItemCeil(worldPos)
  }
}
