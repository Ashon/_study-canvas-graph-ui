'use client'

import { Line, Path } from "@components/graphic"
import { EventCanvas } from "@components/EventCanvas"
import { Drawable, Point, View } from "@components/graphic/types"

const l1 = {
  ...Line(0, 0, 500, 300, {
    style: {
      stroke: 'lime',
      strokeWidth: 3
    }
  }) as Drawable,
  onHover: (point: Point, view: View) => {
    console.log('hover', point, view)
  }
}

const l2 = {
  ...Line(10, 10, 80, 80, {
    style: {
      stroke: '#ff6',
      strokeWidth: 1
    }
  }) as Drawable,
  onClick: (point: Point, view: View) => {
    console.log('l2 click', point, view)
  }
}

const l3 = Line(10, 10, 80, 80, {
  style: {
    stroke: '#ff0',
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

const l4 = Line(20, 10, 20, 50, {
  style: {
    stroke: 'red',
    strokeWidth: 1
  }
})

const l5 = Line(500, 300, 480, 260, {
  style: {
    stroke: '#f00',
    strokeWidth: 3,
    lineCap: 'round'
  },
})

const p1 = {
  ...Path('M50,100 C80,50 120,150 150,100', {
    style: {
      stroke: '#aaf',
      strokeWidth: 1,
    }
  }) as Drawable,
  onClick: () => {
    console.log('click')
  }
}

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
  return (
    <EventCanvas
      style={{
        margin: '100px auto',
        width: 500,
        height: 300,
      }}
      components={[l1, l2, l3, l4, l5, p1, p2]}
    />
  )
}
