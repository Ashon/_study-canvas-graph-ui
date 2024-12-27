import { useRef, useEffect, useState, useMemo } from 'react'
import { BufferedCanvas } from '@components/graphic'
import { CanvasRef, Drawable, View } from '@components/graphic/types'

type EventCanvasProps = {
  style: React.CSSProperties
  components?: (Drawable | View | null | undefined)[]
}

const backgroundStyle = {
  backgroundColor: '#333',
  backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
  backgroundSize: '14px 14px',
}

export const EventCanvas = ({
  style,
  components
}: EventCanvasProps) => {

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<CanvasRef>(null)
  const [point, setPoint] = useState({x: 0, y: 0})

  const validComponents = useMemo(() => (
    components?.filter(component => component !== null)
  ), [components])

  const memoizedCanvas = useMemo(() => (
    <BufferedCanvas
      ref={canvasRef}
      style={{
        width: style.width,
        height: style.height,
        ...backgroundStyle
      }}
      fps={60}
      autoStart={true}
      onRepaint={(ctx, ts) => {
        validComponents?.forEach((c) => c?.draw?.(ctx, ts))
      }}
    />
  ), [style, validComponents])

  const [hoverObject, setHoverObject] = useState<View | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!validComponents) return

    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const canvasX = e.clientX - bounds.left
    const canvasY = e.clientY - bounds.top

    setPoint({x: canvasX, y: canvasY})
    setHoverObject(null)

    for (const component of validComponents) {
      if (component?.intersects?.(canvasX, canvasY)) {
        setHoverObject(component)
        return
      }
    }
  }

  const onMouseLeave = () => {
    setHoverObject(null)
    setPoint({x: 0, y: 0})
  }

  const onClick = () => {
    if (!hoverObject) return
    hoverObject.onClick?.()
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.style.cursor = hoverObject ? 'pointer' : 'default'
  }, [hoverObject])

  return (
    <div style={style}>
      <div
        ref={containerRef}
        style={{
          userSelect: 'none'
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {memoizedCanvas}
      </div>

      <div style={{
        color: 'white',
        marginTop: 10,
        gap: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div>
          {hoverObject ? 'selected' : 'not selected'}
        </div>
        <div>
          {point.x} {point.y}
        </div>
        <div>
          <pre>{JSON.stringify(hoverObject, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
