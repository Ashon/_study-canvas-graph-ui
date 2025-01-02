import {
  AnimationProps,
  DrawableStyleProps,
  Context2D,
  Drawable,
} from '../../types'

type CircleProps = {
  style?: DrawableStyleProps
  animation?: AnimationProps
}

interface CircleType extends Drawable {
  x: number
  y: number
  r: number
}

export const Circle = (
  x: number,
  y: number,
  r: number,
  { style, animation }: CircleProps
): CircleType | null => {
  if (typeof window === 'undefined') return null
  if (typeof document === 'undefined') return null

  return {
    x,
    y,
    r,
    style,
    animation,
    draw: function(this, ctx: Context2D) {
      ctx.strokeStyle = this.style?.stroke || '#000'
      ctx.lineWidth = this.style?.strokeWidth as number || 1
      ctx.fillStyle = this.style?.fill || '#000'

      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    },
    intersects: function(this, x: number, y: number, gap = 5) {
      return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) <= this.r + gap
    }
  }
}
