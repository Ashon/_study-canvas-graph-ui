'use client'

import {
  LineStyleProps,
  AnimationProps,
  Context2D
} from './types'
import { getPathTotalLength } from './utils'
import { easingMethods } from './easing'

type PathStyleProps = {
  style?: LineStyleProps
  animation?: AnimationProps
}

export const Path = (
  pathData: string,
  { style, animation }: PathStyleProps
) => {

  const pathLength = getPathTotalLength(pathData)

  return {
    pathData,
    style,
    animation,
    length: pathLength,
    draw: function(this: any, ctx: Context2D, ts: number) {
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
          ctx.lineDashOffset = from + pathLength * easingFunction(progress)
        } else {
          ctx.lineDashOffset = from + pathLength * progress
        }

        ctx.setLineDash(this.style?.lineDash || [])
        ctx.setLineDash([1, pathLength])
      }

      ctx.beginPath()
      if (this.$path === undefined) {
        this.$path = new Path2D(pathData)
      }
      ctx.stroke(this.$path)
      ctx.setLineDash([])
    }
  }
}
