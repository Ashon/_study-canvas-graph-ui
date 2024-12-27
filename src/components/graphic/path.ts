'use client'

import {
  DrawableStyleProps,
  AnimationProps,
  Context2D,
  Drawable
} from './types'
import { getPathTotalLength } from './utils'
import { easingMethods } from './easing'

type PathStyleProps = {
  style?: DrawableStyleProps
  animation?: AnimationProps
}

interface PathType extends Drawable {
  pathData: string
  length: number
}

export const Path = (
  pathData: string,
  { style, animation }: PathStyleProps
): PathType | null => {
  if (typeof window === 'undefined') return null
  if (typeof document === 'undefined') return null

  const pathLength = getPathTotalLength(pathData)
  const $path = new Path2D(pathData)

  return {
    pathData,
    style,
    animation,
    length: pathLength,
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
          ctx.lineDashOffset = from + pathLength * easingFunction(progress)
        } else {
          ctx.lineDashOffset = from + pathLength * progress
        }

        ctx.setLineDash(this.style?.lineDash || [])
        ctx.setLineDash([1, pathLength])
      }

      ctx.beginPath()
      ctx.stroke($path)
      if (this.style?.fill) {
        ctx.fillStyle = this.style.fill
        ctx.fill($path)
      }
      ctx.setLineDash([])
    },
    intersects: function(this, x: number, y: number, gap: number = 5) {
      // 임시 캔버스 컨텍스트 생성
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')

      if (!tempCtx) return false

      // gap을 고려한 히트 영역 그리기
      tempCtx.lineWidth = gap * 2
      tempCtx.strokeStyle = '#000'

      // 패스 그리기
      tempCtx.stroke($path)

      // 주어진 좌표에서 픽셀 검사
      const pixel = tempCtx.getImageData(x, y, 1, 1).data

      // 알파 값이 0보다 크면 충돌로 간주
      return pixel[3] > 0
    }
  }
}
