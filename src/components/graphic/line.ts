import {
  AnimationProps,
  DrawableStyleProps,
  Context2D,
  Drawable,
} from '../../types'
import { getPathTotalLength } from './utils'
import { easingMethods } from './easing'

type LineProps = {
  style?: DrawableStyleProps
  animation?: AnimationProps
}

interface LineType extends Drawable {
  x1: number
  y1: number
  x2: number
  y2: number
  length: number
}

export const Line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  { style, animation }: LineProps
): LineType | null => {
  if (typeof window === 'undefined') return null
  if (typeof document === 'undefined') return null

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
        ctx.setLineDash([1, lineLength / (this.animation?.lineDash?.nDots || 1)])
      }

      ctx.beginPath()
      ctx.moveTo(this.x1, this.y1)
      ctx.lineTo(this.x2, this.y2)
      ctx.stroke()
      ctx.fill()

      ctx.setLineDash([])
    },
    intersects: function(this, x: number, y: number, gap = 10) {
      const A = x - this.x1
      const B = y - this.y1
      const C = this.x2 - this.x1
      const D = this.y2 - this.y1

      const dot = A * C + B * D
      const lenSq = C * C + D * D
      let param = -1

      if (lenSq !== 0) {
        param = dot / lenSq
      }

      let xx, yy

      if (param < 0) {
        xx = this.x1
        yy = this.y1
      } else if (param > 1) {
        xx = this.x2
        yy = this.y2
      } else {
        xx = this.x1 + param * C
        yy = this.y1 + param * D
      }

      const dx = x - xx
      const dy = y - yy
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 거리가 선의 두께의 절반보다 작으면 교차로 판단
      return distance <= ((this.style?.strokeWidth as number + gap || 1) / 2)
    }
  }
}
