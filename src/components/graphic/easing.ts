'use client'

const easeIn = (t: number) => t * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2)
const easeInOut = (t: number) => t < 0.5 ? easeIn(t * 2) / 2 : easeOut(t * 2 - 1) / 2 + 0.5

export const easingMethods: Record<string, (t: number) => number> = {
  'ease-in': easeIn,
  'ease-out': easeOut,
  'ease-in-out': easeInOut
}
