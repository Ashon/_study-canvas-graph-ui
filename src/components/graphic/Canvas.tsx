'use client'

import {
  forwardRef,
  useRef,
  ForwardedRef,
  useImperativeHandle,
  useEffect,
  useCallback
} from 'react'
import { CanvasRef } from './types'

type RepaintSignature = (
  context: OffscreenCanvasRenderingContext2D,
  ts: number
) => void

type Props = {
  className?: string
  style?: React.CSSProperties
  fps?: number
  resolution?: number
  onRepaint?: RepaintSignature
  autoStart?: boolean
}

export const Canvas = forwardRef(({
  className,
  style,
  fps = 60,
  resolution = 2,
  onRepaint = () => {},
  autoStart = false
}: Props, ref: ForwardedRef<CanvasRef>) => {

  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasCtxt = useRef<CanvasRenderingContext2D | null | undefined>(undefined)
  const bufferedCanvasRef = useRef<OffscreenCanvas | null>(null)
  const bufferedCtxt = useRef<OffscreenCanvasRenderingContext2D | null>(null)

  const lastTimeRef = useRef<number>(0)
  const requestAnimationIdRef = useRef<number | null>(null)
  const repaintRef = useRef<RepaintSignature | null>(null)

  const interval = 1000 / fps

  useEffect(() => {
    if (!rootRef.current) return
    const scaleFactor = devicePixelRatio * resolution
    const styleScale = 1 / scaleFactor
    const rect = rootRef.current.getBoundingClientRect()

    canvasRef.current!.width = rect.width
    canvasRef.current!.height = rect.height
    canvasRef.current!.style.width = rect.width.toString()
    canvasRef.current!.style.height = rect.height.toString()
    canvasRef.current!.style.transformOrigin = 'top left'
    canvasRef.current!.style.scale = (1 / resolution).toString()

    canvasCtxt.current = canvasRef.current?.getContext('2d')
    if (!canvasCtxt.current) throw new Error('Failed to get canvas context')

    canvasCtxt.current.canvas.width  = rect.width * scaleFactor
    canvasCtxt.current.canvas.height = rect.height * scaleFactor
    canvasCtxt.current.scale(styleScale, styleScale)

    bufferedCanvasRef.current = new OffscreenCanvas(
      canvasCtxt.current.canvas.width,
      canvasCtxt.current.canvas.height
    )

    bufferedCtxt.current = bufferedCanvasRef.current.getContext('2d')

    const observer = new ResizeObserver(() => {
      if (!rootRef.current) return

      const rect = rootRef.current.getBoundingClientRect()

      canvasRef.current!.style.width = rect.width.toString()
      canvasRef.current!.style.height = rect.height.toString()
      canvasRef.current!.style.transformOrigin = 'top left'
      canvasRef.current!.style.scale = styleScale.toString()

      if (!canvasCtxt.current) return
      canvasCtxt.current.canvas.width  = rect.width * scaleFactor
      canvasCtxt.current.canvas.height = rect.height * scaleFactor
      canvasCtxt.current.scale(styleScale, styleScale)

      if (!bufferedCtxt.current) return
      bufferedCtxt.current.canvas.width  = rect.width * scaleFactor
      bufferedCtxt.current.canvas.height = rect.height * scaleFactor
      bufferedCtxt.current.scale(scaleFactor, scaleFactor)
    })

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    repaintRef.current = onRepaint

    return () => observer.disconnect()
  }, [onRepaint, resolution])

  const repaint = useCallback((ts: number) => {
    if (bufferedCanvasRef.current && bufferedCtxt.current && canvasCtxt.current && repaintRef.current) {
      const deltaTime = ts - lastTimeRef.current
      if (deltaTime > interval) {
        const scaleFactor = devicePixelRatio * resolution
        const styleScale = 1 / scaleFactor

        lastTimeRef.current = ts - (deltaTime % interval)

        // 버퍼 캔버스에 미리 그림
        bufferedCtxt.current.save()
        bufferedCtxt.current.clearRect(
          0, 0,
          canvasCtxt.current.canvas.width * scaleFactor,
          canvasCtxt.current.canvas.height * scaleFactor
        )

        // 사용자 리페인트 함수 호출
        repaintRef.current(bufferedCtxt.current, ts)
        bufferedCtxt.current.restore()

        // 캔버스에 이미지 페인트
        canvasCtxt.current.clearRect(
          0, 0,
          canvasCtxt.current.canvas.width * scaleFactor,
          canvasCtxt.current.canvas.height * scaleFactor
        )

        canvasCtxt.current.scale(scaleFactor, scaleFactor)
        canvasCtxt.current.drawImage(
          bufferedCanvasRef.current,
          0, 0,
          bufferedCanvasRef.current.width,
          bufferedCanvasRef.current.height,
          0, 0,
          canvasCtxt.current.canvas.width,
          canvasCtxt.current.canvas.height
        )
        canvasCtxt.current.scale(styleScale, styleScale)
      }
    }
    requestAnimationIdRef.current = window.requestAnimationFrame(repaint)
  }, [interval, resolution])

  const start = useCallback(() => {
    if (requestAnimationIdRef.current === null) {
      requestAnimationIdRef.current = window.requestAnimationFrame(repaint)
    }
  }, [repaint])

  const stop = useCallback(() => {
    if (requestAnimationIdRef.current !== null) {
      window.cancelAnimationFrame(requestAnimationIdRef.current)
      requestAnimationIdRef.current = null
    }
  }, [])

  useEffect(() => {
    if (autoStart) {
      start()
    } else {
      stop()
    }
  }, [autoStart, start, stop])

  useImperativeHandle(ref, () => ({ start, stop }), [start, stop])

  return (
    <div className={className} ref={rootRef} style={style}>
      <canvas ref={canvasRef} />
    </div>
  )
})

Canvas.displayName = 'Canvas'
