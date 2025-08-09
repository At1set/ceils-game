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

export { Vector2D, lerp, clamp }
