import Entity from "./Entity.js"

export default class GameObject extends Entity {
  constructor() {
    super()
  }
  
  update() {}

  draw(ctx, camera, gridSize) {}
}
