export const Entitys = new Map()

export default class Entity {
  constructor() {
    this.id = crypto.randomUUID()
    Entitys.set(this.id, this)
  }

  destroy() {
    Entitys.delete(this.id)
  }
}
