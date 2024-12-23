'use client'

export const getPathTotalLength = (pathData: string) => {
  if (typeof window === 'undefined') return 0
  if (typeof document === 'undefined') return 0

  const path = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  )
  path.setAttribute('d', pathData)
  return path.getTotalLength()
}
