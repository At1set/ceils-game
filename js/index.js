import GameManager from "./GameManager.js"

window.onload = () => {
  const canvas = document.getElementById("root")

  canvas.width = window.document.body.clientWidth
  canvas.height = window.document.body.clientHeight

  const gameManager = new GameManager(canvas, toolbar)
  gameManager.init().startGameLoop()
}
