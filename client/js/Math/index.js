import Point from "../utils/Point.js"
import Vector2D from "./Vector2D.js"

function clamp(value, max, min) {
  if (max < value) return max
  else if (min > value) return min
  return value
}

function lerp(point1, point2, rate) {
  rate = clamp(rate, 1, 0)
  return Point.add(point1, Point.minus(point2, point1).multiple(rate))
}

function smoothDamp(current, target, currentVelocity, smoothTime, deltaTime, maxSpeed = Infinity) {
  smoothTime = Math.max(0.0001, smoothTime) // чтобы избежать деления на ноль

  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

  let change = current - target
  const originalTo = target

  // Ограничение по максимальной скорости
  const maxChange = maxSpeed * smoothTime
  change = Math.max(-maxChange, Math.min(maxChange, change))
  target = current - change

  let temp = (currentVelocity.value + omega * change) * deltaTime
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp
  let output = target + (change + temp) * exp

  // Корректировка перепрыгивания через цель
  if ((originalTo - current > 0) === (output > originalTo)) {
    output = originalTo
    currentVelocity.value = (output - originalTo) / deltaTime
  }

  return output
}


export { Vector2D, lerp, clamp, smoothDamp }
