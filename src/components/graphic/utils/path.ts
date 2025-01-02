import { BoundingBox, Edge, Point } from "../../../types"

export const getAnchorPoints = (
  node: BoundingBox,
  scale: number,
  viewOffset: Point
) => {
  const nodeWidth = node.width
  const nodeHeight = node.height

  const x = node.x * scale + viewOffset.x
  const y = node.y * scale + viewOffset.y

  return {
    top: {
      x: x,
      y: y - nodeHeight / 2
    },
    right: {
      x: x + nodeWidth / 2,
      y: y
    },
    bottom: {
      x: x,
      y: y + nodeHeight / 2
    },
    left: {
      x: x - nodeWidth / 2,
      y: y
    }
  }
}

// 두 점 사이의 거리 계산
export const getDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export const getAnchorDirection = (anchorPoint: Point, nodeCenter: Point) => {
  const dx = anchorPoint.x - nodeCenter.x
  const dy = anchorPoint.y - nodeCenter.y

  // 앵커 포인트의 방향 결정 (top, right, bottom, left)
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left'
  } else {
    return dy > 0 ? 'bottom' : 'top'
  }
}

export const getPathData = (
  edge: Edge,
  scale: number,
  viewOffset: Point
) => {
  const sourceAnchors = getAnchorPoints(edge.source, scale, viewOffset)
  const targetAnchors = getAnchorPoints(edge.target, scale, viewOffset)

  // 가장 가까운 앵커 포인트 쌍 찾기
  let minDistance = Infinity
  let bestSourceAnchor = { x: 0, y: 0 }
  let bestTargetAnchor = { x: 0, y: 0 }

  Object.values(sourceAnchors).forEach(sourceAnchor => {
    Object.values(targetAnchors).forEach(targetAnchor => {
      const distance = getDistance(sourceAnchor, targetAnchor)
      if (distance < minDistance) {
        minDistance = distance
        bestSourceAnchor = sourceAnchor
        bestTargetAnchor = targetAnchor
      }
    })
  })

  // 베지어 커브의 제어점 계산
  const sourceCenter = {
    x: edge.source.x * scale + viewOffset.x,
    y: edge.source.y * scale + viewOffset.y
  }
  const targetCenter = {
    x: edge.target.x * scale + viewOffset.x,
    y: edge.target.y * scale + viewOffset.y
  }

  const sourceDirection = getAnchorDirection(bestSourceAnchor, sourceCenter)
  const targetDirection = getAnchorDirection(bestTargetAnchor, targetCenter)

  const controlPointOffset = Math.min(100 * scale, minDistance * 0.5)

  // 방향에 따른 제어점 계산
  let sourceControlX = bestSourceAnchor.x
  let sourceControlY = bestSourceAnchor.y
  let targetControlX = bestTargetAnchor.x
  let targetControlY = bestTargetAnchor.y

  switch (sourceDirection) {
    case 'right':
      sourceControlX += controlPointOffset
      break
    case 'left':
      sourceControlX -= controlPointOffset
      break
    case 'bottom':
      sourceControlY += controlPointOffset
      break
    case 'top':
      sourceControlY -= controlPointOffset
      break
  }

  switch (targetDirection) {
    case 'right':
      targetControlX += controlPointOffset
      break
    case 'left':
      targetControlX -= controlPointOffset
      break
    case 'bottom':
      targetControlY += controlPointOffset
      break
    case 'top':
      targetControlY -= controlPointOffset
      break
  }

  // path 데이터를 d 객체에 저장 (소켓 위치 계산을 위해)
  const pathData = {
    source: bestSourceAnchor,
    target: bestTargetAnchor,
    sourceControl: {
      x: sourceControlX,
      y: sourceControlY
    },
    targetControl: {
      x: targetControlX,
      y: targetControlY
    },
    path: [
      `M${bestSourceAnchor.x},${bestSourceAnchor.y}`,
      `C${sourceControlX},${sourceControlY}`,
      `${targetControlX},${targetControlY}`,
      `${bestTargetAnchor.x},${bestTargetAnchor.y}`
    ].join(' ')
  }

  return pathData
}
