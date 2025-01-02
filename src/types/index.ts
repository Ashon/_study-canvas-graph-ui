export type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export type Point = {
  x: number
  y: number
}

export type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
}

export interface Drawable {
  style?: DrawableStyleProps
  animation?: AnimationProps
  draw: (ctx: Context2D, ts: number) => void
  intersects: (x: number, y: number) => boolean
}

export interface View extends Drawable {
  onClick?: (point?: Point, view?: View) => void
  onMouseEnter?: (point?: Point, view?: View) => void
  onMouseLeave?: (point?: Point, view?: View) => void
  onDrag?: (point?: Point, view?: View) => void
  onDragEnd?: (point?: Point, view?: View) => void
}

export type DrawableStyleProps = {
  stroke?: string
  strokeWidth?: number
  lineDash?: number[]
  lineCap?: CanvasLineCap
  fill?: string
}

export type AnimationProps = {
  lineDashOffset?: {
    duration: number
    from?: number
    to?: number
    easing?: string
  }
  lineDash?: {
    nDots?: number
  }
}

export type CanvasRef = {
  start: () => void
  stop: () => void
  getBoundingClientRect: () => DOMRect | null
}

export type Node = {
  x: number
  y: number
  width: number
  height: number
}

export type Edge = {
  source: Node
  target: Node
}
