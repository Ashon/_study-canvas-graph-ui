
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

export type GraphCanvasRef = {
  node: () => HTMLCanvasElement | null
  start: () => void
  stop: () => void
}
