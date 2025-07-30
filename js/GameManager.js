import Point from "./Point.js"
import Camera from "./Camera.js"
import Canvas from "./Canvas.js"
import GameField from "./GameField.js"
import Player from "./Player.js"
import Toolbar from "./Toolbar.js"
import Cleaner from "./Placement/Cleaner.js"

export default class GameManager {
  globals = {}
  initialScale = 1
  gridSize = 35
  isDragging = false
  startDragPoint = new Point()
  lastOffset = new Point()

  frameCount = 0

  constructor(canvas) {
    this.canvas = canvas
  }

  init() {
    this.setupGlobals()
    this.setupEventListeners()

    this.toolbar.init()
    this.canvasController.update()

    return this
  }

  setupGlobals() {
    const { gridSize, initialScale } = this
    this.globals.fps = 0
    this.globals.gridSize = gridSize
    const toolbar = document.getElementById("toolbar")

    this.camera = new Camera(gridSize, initialScale, this.globals)
    this.canvasController = new Canvas(this.canvas, this.globals)
    this.gameField = new GameField()
    this.player = new Player(this.globals)
    this.toolbar = new Toolbar(toolbar, this.globals)

    Object.assign(this.globals, {
      camera: this.camera,
      canvas: this.canvasController,
      gameField: this.gameField,
      player: this.player,
    })
  }

  setupEventListeners() {
    const canvas = this.canvas
    const camera = this.camera
    const player = this.player

    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true
      this.startDragPoint = new Point(e.clientX, e.clientY)
      this.lastOffset = camera.offset.clone()
    })

    window.addEventListener("mouseup", (e) => {
      this.isDragging = false
    })

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.startDragPoint.x
        const dy = e.clientY - this.startDragPoint.y
        camera.offset.x += dx / camera.scale
        camera.offset.y += dy / camera.scale
        this.startDragPoint = new Point(e.clientX, e.clientY)
      }
      player.mouseMove(e)
    })

    canvas.addEventListener("click", (e) => {
      if (
        this.lastOffset.x !== camera.offset.x ||
        this.lastOffset.y !== camera.offset.y
      )
        return

      if (player.selectedItem instanceof Cleaner) player.removeItem(e)
      else player.placeItem(e)
    })

    window.addEventListener("wheel", (e) => {
      camera.zoom(e.deltaY)
      player.mouseMove(e)
    })
  }

  startGameLoop() {
    const loop = (timestamp) => {
      const deltaTime = (timestamp - this.lastFrameTime) / 1000
      this.lastFrameTime = timestamp

      this.frameCount++
      if (timestamp - this.lastFpsUpdate > 1000) {
        this.globals.fps = this.frameCount
        this.frameCount = 0
        this.lastFpsUpdate = timestamp
      }

      this.canvasController.update()
      requestAnimationFrame(loop)
    }

    requestAnimationFrame((timestamp) => {
      this.lastFrameTime = timestamp
      this.lastFpsUpdate = timestamp
      requestAnimationFrame(loop)
    })
  }
}
