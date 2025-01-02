import { Context2D, Drawable } from '../../types'

interface GroupType extends Drawable {
  components: Drawable[]
  id: string
}

export const Group = (components: Drawable[], { id }: { id: string }): GroupType | null => {
  if (typeof window === 'undefined') return null
  if (typeof document === 'undefined') return null

  return {
    id,
    components,
    draw: function(this, ctx: Context2D, ts: number) {
      this.components?.forEach((component) => component.draw(ctx, ts))
    },
    intersects: function(this, x: number, y: number) {
      return this.components?.some((component) => component.intersects(x, y))
    }
  }
}
