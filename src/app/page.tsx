'use client'

import { useRef } from "react"
import { GraphCanvas } from "@components/graphic/GraphCanvas"
import { Line } from "@components/graphic/line"
import { getPathTotalLength } from "@components/graphic/utils"
import { GraphCanvasRef } from "@components/graphic/types"

export default function Home() {
  const canvasRef = useRef<GraphCanvasRef>(null)
  const l = Line(0, 0, 500, 300, {
    style: {
      stroke: 'red',
      strokeWidth: 1
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
      strokeWidth: 3,
      lineCap: 'round'
    },
    animation: {
      lineDashOffset: {
        duration: 5000,
        from: 0,
      }
    }
  })

  const lineLength = l4.getLineLength()
  l4.style!.lineDash = [1, lineLength]
  l4.animation!.lineDashOffset!.to = lineLength

  return (
    <div>
      <GraphCanvas
        ref={canvasRef}
        style={{
          margin: '20px auto',
          width: '500px',
          height: '300px',
          backgroundColor: '#fafafa',
          backgroundImage: `
            radial-gradient(circle at center, #ddd 1px, transparent 1px)
          `,
          backgroundSize: '14px 14px',
          transform: `translate(0px, 0px)`,
        }}
        fps={60}
        autoStart={true}
        onRepaint={(ctx, ts) => {
          l.draw(ctx, ts)
          l2.draw(ctx, ts)
          l3.draw(ctx, ts)
          l4.draw(ctx, ts)

          const pathData = 'M50,100 C80,50 120,150 150,100'
          const simpleSCurve = new Path2D(pathData)
          ctx.strokeStyle = '#000'
          ctx.lineWidth = 1
          ctx.setLineDash([])
          ctx.stroke(simpleSCurve)

          const length = getPathTotalLength(pathData)
          const animationDuration = 2000

          ctx.strokeStyle = '#000'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'

          // velocity = distance / time
          // position in time = velocity * time
          const offset = (length / animationDuration) * ts
          ctx.lineDashOffset = offset
          ctx.setLineDash([1, length])
          ctx.stroke(simpleSCurve)
        }}
      />
    </div>
  )
}
