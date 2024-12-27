import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@components/graphic'
import { CanvasRef, Drawable } from '@components/graphic/types'

type EventCanvasProps = {
  style: React.CSSProperties
  components: (Drawable | null)[]
}

export const EventCanvas = ({ style, components }: EventCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<CanvasRef>(null)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const validComponents = components.filter(component => component !== null)

  useEffect(() => {
    if (!containerRef.current) return

    const { width, height } = containerRef.current.getBoundingClientRect()
    setWidth(width)
    setHeight(height)
  }, [])

  return (
    <div style={style} ref={containerRef}>
      {width > 0 && height > 0 && (
        <Canvas
          ref={canvasRef}
          style={{
            width: width,
            height: height,
            backgroundColor: '#333',
            backgroundImage: 'radial-gradient(circle at center, #444 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
          fps={60}
          autoStart={true}
          onRepaint={(ctx, ts) => {
            validComponents.forEach((component) => component.draw(ctx, ts))
          }}
        />
      )}
    </div>
  )
}