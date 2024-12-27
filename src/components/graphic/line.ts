'use client'

import {
  AnimationProps,
  LineStyleProps,
  Context2D,
} from './types'
import { getPathTotalLength } from './utils'
import { easingMethods } from './easing'

type LineProps = {
  style?: LineStyleProps
  animation?: AnimationProps
}

export const Line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  { style, animation }: LineProps
) => {

  const lineLength = getPathTotalLength(`M${x1},${y1} L${x2},${y2}`)

  return {
    x1,
    y1,
    x2,
    y2,
    style,
    animation,
    length: lineLength,
    draw: function(this, ctx: Context2D, ts: number) {
      ctx.strokeStyle = this.style?.stroke || '#000'
      ctx.lineWidth = this.style?.strokeWidth as number || 1
      ctx.lineCap = this.style?.lineCap || 'butt'

      if (this.animation?.lineDashOffset) {
        const from = this.animation.lineDashOffset.from || 0
        const lineAnimationDuration = this.animation.lineDashOffset.duration

        // easing 고려
        const progress = (ts % lineAnimationDuration) / lineAnimationDuration
        if (this.animation.lineDashOffset.easing) {
          const easingFunction = easingMethods[this.animation.lineDashOffset.easing]
          ctx.lineDashOffset = from + lineLength * easingFunction(progress)
        } else {
          ctx.lineDashOffset = from + lineLength * progress
        }

        ctx.setLineDash(this.style?.lineDash || [])
        ctx.setLineDash([1, lineLength])
      }

      ctx.beginPath()
      ctx.moveTo(this.x1, this.y1)
      ctx.lineTo(this.x2, this.y2)
      ctx.stroke()

      ctx.setLineDash([])
    }
  }
}
