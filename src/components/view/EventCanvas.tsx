import { useRef, useEffect, useState, useMemo } from 'react'
import { BufferedCanvas } from '../graphic'
import { CanvasRef, Drawable, View } from '../../types'

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
  const [hoverSubject, setHoverSubject] = useState<View | null>(null)
  const [dragSubject, setDragSubject] = useState<View | null>(null)

  const validComponents = useMemo(() => (
    components?.filter(component => component !== null)
  ), [components])

  const componentsCanInteract = useMemo<View[]>(() => (
    validComponents?.filter((component: View | undefined) => {
      if (!component) return false
      return component.onMouseEnter
      || component.onMouseLeave
      || component.onClick
      || component.onDrag
      || component.onDragEnd
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

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!componentsCanInteract) return

    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const canvasX = e.clientX - bounds.left
    const canvasY = e.clientY - bounds.top
    const point = {x: canvasX, y: canvasY}
    setPoint(point)

    for (const component of componentsCanInteract) {
      if (component?.intersects?.(canvasX, canvasY)) {
        if (component.onDrag) {
          setDragSubject(component)
          return
        }
      }
    }
  }

  const onMouseUp = () => {
    if (!containerRef.current) return
    if (!dragSubject) return

    dragSubject.onDragEnd?.(point, dragSubject)
    containerRef.current.style.cursor = 'grab'

    setDragSubject(null)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!componentsCanInteract) return

    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const canvasX = e.clientX - bounds.left
    const canvasY = e.clientY - bounds.top
    const point = {x: canvasX, y: canvasY}
    setPoint(point)
    setHoverSubject(null)

    if (dragSubject) {
      dragSubject.onDrag?.(point, dragSubject)
      return
    }

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

    if (hoverSubject) {
      if (hoverSubject.onDrag) {
        containerRef.current.style.cursor = 'grab'
        return
      }

      if (hoverSubject.onClick) {
        containerRef.current.style.cursor = 'pointer'
        return
      }
    }

    if (dragSubject) {
      containerRef.current.style.cursor = 'grabbing'
      return
    }

    containerRef.current.style.cursor = 'default'
  }, [hoverSubject, dragSubject])

  return (
    <div className={className} style={style}>
      <div
        ref={containerRef}
        style={{
          userSelect: 'none'
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {memoizedCanvas}
      </div>
    </div>
  )
}
