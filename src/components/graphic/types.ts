export type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export type Drawable = {
  draw: (ctx: Context2D, ts: number) => void
  intersects: (x: number, y: number) => boolean
}

export interface View extends Drawable {
  onClick?: () => void
}

export type LineStyleProps = {
  stroke?: string
  strokeWidth?: number
  lineDash?: number[]
  lineCap?: CanvasLineCap
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
