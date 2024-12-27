'use client'

import {
  AnimationProps,
  DrawableStyleProps,
  Context2D,
  Drawable,
} from './types'

type CircleProps = {
  style?: DrawableStyleProps
  animation?: AnimationProps
}

interface CircleType extends Drawable {
  cx: number
  cy: number
  r: number
}

export const Circle = (
  cx: number,
  cy: number,
  r: number,
  { style, animation }: CircleProps
): CircleType | null => {
  if (typeof window === 'undefined') return null
  if (typeof document === 'undefined') return null

  return {
    cx,
    cy,
    r,
    style,
    animation,
    draw: function(this, ctx: Context2D) {
      ctx.strokeStyle = this.style?.stroke || '#000'
      ctx.lineWidth = this.style?.strokeWidth as number || 1
      ctx.fillStyle = this.style?.fill || '#000'

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    },
    intersects: (x: number, y: number, gap: number = 5) => {
      return Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) <= r + gap
    }
  }
}
