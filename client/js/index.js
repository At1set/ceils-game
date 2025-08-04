import GameManager from "./GameManager.js"

window.onload = () => {
  const canvas = document.getElementById("root")

  canvas.width = window.document.body.clientWidth
  canvas.height = window.document.body.clientHeight

  const gameManager = new GameManager(canvas)
  gameManager.init().startGameLoop()

  const customCursor = document.getElementById("custom-cursor")
  window.addEventListener("mousemove", (e) => {
    const cursorStyle = getComputedStyle(e.target).cursor
    if (cursorStyle !== "none") {
      customCursor.style.display = "none"
    } else {
      customCursor.style.display = "block"
      customCursor.style.left = e.clientX + "px"
      customCursor.style.top = e.clientY + "px"
    }
  })
  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && !e.toElement) {
      // Мышь ушла из окна браузера
      customCursor.style.display = "none"
    }
  })
}
