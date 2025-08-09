import Entity from "./Entity.js"

export default class GameObject extends Entity {
  constructor() {
    super()
  }
  
  awake() {}

  update() {}

  fixedUpdate() {}

  draw(ctx, camera, gridSize) {}
}
