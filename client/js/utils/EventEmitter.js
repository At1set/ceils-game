const eventHandlers = new Map()

export default class EventEmitter {
  constructor() {}

  on(event, handler) {
    const handlers = eventHandlers.get(event)

    if (!handlers) {
      eventHandlers.set(event, new Set([handler]))
    } else {
      handlers.add(handler)
    }
  }

  off(event, handler) {
    const handlers = eventHandlers.get(event)
    if (!handlers) return
    else return handlers.delete(handler)
  }

  emit(event, data) {
    const handlers = eventHandlers.get(event)

    if (!handlers) return
    else
      handlers.forEach((handler) => {
        handler(data)
      })
  }
}
