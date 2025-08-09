import EventEmitter from "./utils/EventEmitter.js"
import Camera from "./Camera.js"
import Canvas from "./Canvas.js"
import GameField from "./GameField.js"
import InputController from "./InputController.js"
import Player from "./Player.js"
import Toolbar, { Mods } from "./Toolbar.js"
import SelectTool from "./Tools/Select.js"
import Block from "./GameObjects/Block.js"
import Point from "./utils/Point.js"
import { Entitys } from "./GameObjects/Entity.js"
import InputManager from "./InputManager.js"

export default class GameManager {
  constructor(canvas) {
    this.canvas = canvas
    this.initialScale = 1
    this.events = new EventEmitter()
    this.gridSize = 35
  }

  init() {
    this.setupGlobals()
    this.setupGlobalEventListeners()
    this.canvasController.render()
    return this
  }

  setupGlobals() {
    const { canvas, gridSize, initialScale } = this
    const itemsbar = document.getElementById("itemsbar")
    const toolsbar = document.getElementById("toolbar")
    const modeSwitchingPanel = document.getElementById("modeSwitchingPanel")

    this.inputManager = new InputManager()

    this.inputController = new InputController()
    this.inputController.setupEventListeners(canvas)

    this.itemsbar = new Toolbar(itemsbar, toolsbar, modeSwitchingPanel)
    this.itemsbar.setupEventListeners()

    this.camera = new Camera(initialScale)
    this.canvasController = new Canvas(canvas, gridSize)
    this.gameField = new GameField()
    this.player = new Player(new Block())
  }

  setupGlobalEventListeners() {
    const { inputController, itemsbar, camera, canvasController, player } = this

    let startDragPoint = new Point()
    inputController.on("mouse.click", (e) => {
      const isMoved =
        Point.getVectorLength(camera.lastPosition, camera.position) > 5
      if (isMoved) return

      inputController.emit("player.action", e)
    })

    inputController.on("mouse.move", ({ event, state }) => {
      const playerWithSelectTool = player.selectedTool instanceof SelectTool
      const playerHasItemOrTool = Boolean(
        player.selectedItem || player.selectedTool
      )
      if (
        state.isDragging &&
        itemsbar.mode === Mods.drawOnDragging &&
        playerHasItemOrTool
      )
        return inputController.emit("player.action", event)
      if (playerWithSelectTool || !state.isDragging) return
      inputController.emit("camera.dragging", event)
    })

    return this
  }

  startGameLoop() {
    let lastFrameTime = 0
    let accumulator = 0
    let fixedDeltaTime = 1 / 50

    let lastFpsUpdate = 0
    let fps = 0
    let frameCount = 0

    const { inputManager } = this

    const loop = (timestamp) => {
      const deltaTime = (timestamp - lastFrameTime) / 1000
      lastFrameTime = timestamp

      accumulator += deltaTime
      frameCount++
      if (timestamp - lastFpsUpdate > 1000) {
        fps = frameCount
        this.canvasController.fps = fps
        frameCount = 0
        lastFpsUpdate = timestamp
      }

      inputManager.beforeUpdate()

      // Fixed Update
      while (accumulator >= fixedDeltaTime) {
        this.doFixedUpdate(fixedDeltaTime)
        accumulator -= fixedDeltaTime
      }

      // Update
      this.doUpdateAll(deltaTime)

      inputManager.afterUpdate()

      // Render
      this.canvasController.render()

      requestAnimationFrame(loop)
    }

    this.doAwake()

    requestAnimationFrame((timestamp) => {
      lastFrameTime = timestamp
      lastFpsUpdate = timestamp
      requestAnimationFrame(loop)
    })
  }

  doAwake() {
    for (const entity of Entitys.values()) {
      if (typeof entity.awake === "function") {
        entity.awake()
      }
    }
  }

  doUpdateAll(deltaTime) {
    for (const entity of Entitys.values()) {
      if (typeof entity.update === "function") {
        entity.update(deltaTime)
      }
    }
  }

  doFixedUpdate(fixedDeltaTime) {
    for (const entity of Entitys.values()) {
      if (typeof entity.fixedUpdate === "function") {
        entity.fixedUpdate(fixedDeltaTime)
      }
    }
  }
}
