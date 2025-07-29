import Point from "./Point.js"
import Camera from "./Camera.js"
import Canvas from "./Canvas.js"
import GameField from "./GameField.js"
import Player from "./Player.js"

window.onload = () => {
  const canvas = document.getElementById("root")

  canvas.width = window.document.body.clientWidth
  canvas.height = window.document.body.clientHeight

  const startScale = 1
  let gridSize = 50
  let lastOffset = new Point()
  let isDragging = false
  let startDragPoint = new Point()
  let drawOnMove = false

  const globals = {
    gridSize,
  }
  const camera = new Camera(gridSize, startScale, globals)
  const canvasController = new Canvas(canvas, globals)
  const gameField = new GameField()
  const player = new Player(globals)

  globals.camera = camera
  globals.canvas = canvasController
  globals.gameField = gameField
  globals.player = player

  canvasController.update()

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true
    startDragPoint.x = e.clientX
    startDragPoint.y = e.clientY
    lastOffset = camera.offset.clone()
  })

  canvas.addEventListener("mouseup", (e) => {
    isDragging = false
  })

  window.addEventListener("click", (mouseEvent) => {
    if (lastOffset.x !== camera.offset.x || lastOffset.y !== camera.offset.y)
      return
    player.placeItem(mouseEvent)
    canvasController.update()
    const mousePoint = new Point(mouseEvent.clientX, mouseEvent.clientY)
  })

  canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - startDragPoint.x
      const dy = e.clientY - startDragPoint.y
      camera.offset.x += dx / camera.scale
      camera.offset.y += dy / camera.scale
      startDragPoint.x = e.clientX
      startDragPoint.y = e.clientY
    }
    if (drawOnMove) player.placeItem(e)
    player.mouseMove(e)
    canvasController.update()
  })

  window.addEventListener("wheel", (scaleEvent) => {
    camera.zoom(scaleEvent.deltaY)
    canvasController.update()
  })

  // window.addEventListener("resize", resizeCanvas)
}
