export type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export type EventProps = {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
  onMouseMove?: (e: MouseEvent) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
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
}
