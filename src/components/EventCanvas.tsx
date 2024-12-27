import { useRef, useEffect, useState, useMemo } from 'react'
import { BufferedCanvas } from '@components/graphic'
import { CanvasRef, Drawable, View } from '@components/graphic/types'

type EventCanvasProps = {
  className?: string
  style: React.CSSProperties
  components?: (Drawable | View | null | undefined)[]
}

const backgroundStyle = {
  backgroundColor: '#333',
  backgroundImage: 'radial-gradient(#444 1px, transparent 0)',
  backgroundSize: '20px 20px',
}

export const EventCanvas = ({ className, style, components }: EventCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<CanvasRef>(null)
  const [point, setPoint] = useState({x: 0, y: 0})

  const validComponents = useMemo(() => (
    components?.filter(component => component !== null)
  ), [components])

  const componentsCanInteract = useMemo<View[]>(() => (
    validComponents?.filter((component: View | undefined) => {
      if (!component) return false
      return component.onMouseEnter
      || component.onMouseLeave
      || component.onClick
    }) as View[]
  ), [validComponents])

  const memoizedCanvas = useMemo(() => (
    <BufferedCanvas
      ref={canvasRef}
      style={{
        width: style.width,
        height: style.height,
        ...backgroundStyle
      }}
      fps={60}
      resolution={2}
      autoStart={true}
      onRepaint={(ctx, ts) => {
        validComponents?.forEach((c) => c?.draw?.(ctx, ts))
      }}
    />
  ), [style, validComponents])

  const [hoverSubject, setHoverSubject] = useState<View | null>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!componentsCanInteract) return

    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const canvasX = e.clientX - bounds.left
    const canvasY = e.clientY - bounds.top
    const point = {x: canvasX, y: canvasY}
    setPoint(point)
    setHoverSubject(null)

    for (const component of componentsCanInteract) {
      if (component?.intersects?.(canvasX, canvasY)) {
        if (hoverSubject !== component) {
          hoverSubject?.onMouseLeave?.(point, hoverSubject)
          component.onMouseEnter?.(point, component)
        }

        setHoverSubject(component)
        return
      }
    }

    hoverSubject?.onMouseLeave?.(point, hoverSubject)
  }

  const onMouseLeave = () => {
    if (hoverSubject) {
      hoverSubject.onMouseLeave?.(point, hoverSubject)
    }
    setHoverSubject(null)
    setPoint({x: 0, y: 0})
  }

  const onClick = () => {
    if (!hoverSubject) return
    hoverSubject.onClick?.(point, hoverSubject)
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.style.cursor = hoverSubject?.onClick ? 'pointer' : 'default'
  }, [hoverSubject])

  return (
    <div className={className} style={style}>
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
          {hoverSubject ? 'selected' : 'not selected'}
        </div>
        <div>
          {point.x} {point.y}
        </div>
        <div>
          <pre>{JSON.stringify(hoverSubject, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
