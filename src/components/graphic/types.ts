export type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export type Point = {
  x: number
  y: number
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
}

export type CanvasRef = {
  start: () => void
  stop: () => void
  getBoundingClientRect: () => DOMRect | null
}
