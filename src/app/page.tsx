'use client'

import { useRef } from "react"
import { CanvasRef } from "@components/graphic/types"
import { Canvas, Line, Path } from "@components/graphic"

const l1 = Line(0, 0, 500, 300, {
  style: {
    stroke: 'lime',
    strokeWidth: 3
  },
  events: {
    onMouseEnter: () => {
      console.log('mouse enter')
    }
  }
})

const l2 = Line(10, 10, 80, 80, {
  style: {
    stroke: '#f66',
    strokeWidth: 1
  }
})

const l3 = Line(20, 10, 20, 50, {
  style: {
    stroke: 'red',
    strokeWidth: 1
  }
})

const l4 = Line(10, 10, 80, 80, {
  style: {
    stroke: '#f00',
    strokeWidth: 10,
    lineCap: 'round'
  },
  animation: {
    lineDashOffset: {
      duration: 5000,
      from: 0,
    }
  }
})

const l5 = Line(500, 300, 480, 260, {
  style: {
    stroke: '#f00',
    strokeWidth: 3,
    lineCap: 'round'
  },
})

const p1 = Path('M50,100 C80,50 120,150 150,100', {
  style: {
    stroke: '#aaf',
    strokeWidth: 1,
  }
})

const p2 = Path('M50,100 C80,50 120,150 150,100', {
  style: {
    stroke: '#aaf',
    strokeWidth: 10,
    lineCap: 'round'
  },
  animation: {
    lineDashOffset: {
      duration: 2000,
    }
  }
})

export default function Home() {
  const canvasRef = useRef<CanvasRef>(null)

  return (
    <div style={{
      background: '#222',
      position: 'absolute',
      width: '100%',
      height: '100%',
    }}>
      <Canvas
        ref={canvasRef}
        style={{
          margin: '200px auto',
          width: '500px',
          height: '300px',
          backgroundColor: '#333',
          backgroundImage: 'radial-gradient(circle at center, #444 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          transform: `translate(0px, 0px)`,
        }}
        fps={60}
        autoStart={true}
        onRepaint={(ctx, ts) => {
          l1.draw(ctx, ts)
          l2.draw(ctx, ts)
          l3.draw(ctx, ts)
          l4.draw(ctx, ts)
          l5.draw(ctx, ts)

          p1.draw(ctx, ts)
          p2.draw(ctx, ts)
        }}
      />
    </div>
  )
}
