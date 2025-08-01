import EventEmitter from "./utils/EventEmitter.js"
import Camera from "./Camera.js"
import Canvas from "./Canvas.js"
import GameField from "./GameField.js"
import InputController from "./InputController.js"
import Player from "./Player.js"
import Toolbar from "./Toolbar.js"
import GameObject from "./Placement/GameObject.js"
import SelectTool from "./Tools/Select.js"

export default class GameManager {
  constructor(canvas) {
    this.canvas = canvas
    this.initialScale = 1
    this.events = new EventEmitter()
    this.fps = 0
    this.gridSize = 35
    this.frameCount = 0
  }

  init() {
    this.setupGlobals()
    this.setupGlobalEventListeners()
    this.canvasController.render()
    return this
  }

  setupGlobals() {
    const { canvas, gridSize, initialScale } = this
    const toolbar = document.getElementById("toolbar")

    this.inputController = new InputController()
    this.inputController.setupEventListeners(canvas)

    this.toolbar = new Toolbar(toolbar)
    this.toolbar.setupEventListeners(canvas)

    this.camera = new Camera(initialScale)
    this.canvasController = new Canvas(canvas, gridSize)
    this.gameField = new GameField()
    this.player = new Player(new GameObject())
  }

  setupGlobalEventListeners() {
    const { inputController, camera, canvasController, player } = this

    inputController.on("mouse.click", (e) => {
      const isMoved =
        camera.lastPosition.x !== camera.position.x ||
        camera.lastPosition.y !== camera.position.y
      if (isMoved) return

      inputController.emit("player.action", e)
    })

    inputController.on("mouse.move", ({ event, state }) => {
      const playerWithSelectTool = player.selectedTool instanceof SelectTool
      if (playerWithSelectTool || !state.isDragging) return
      inputController.emit("camera.dragging", event)
    })

    this.events.on("fps.changed", (newFps) => (canvasController.fps = newFps))

    return this
  }

  startGameLoop() {
    const loop = (timestamp) => {
      const deltaTime = (timestamp - this.lastFrameTime) / 1000
      this.lastFrameTime = timestamp

      this.frameCount++
      if (timestamp - this.lastFpsUpdate > 1000) {
        this.fps = this.frameCount
        this.events.emit("fps.changed", this.fps)
        this.frameCount = 0
        this.lastFpsUpdate = timestamp
      }

      this.canvasController.render()
      requestAnimationFrame(loop)
    }

    requestAnimationFrame((timestamp) => {
      this.lastFrameTime = timestamp
      this.lastFpsUpdate = timestamp
      requestAnimationFrame(loop)
    })
  }
}
