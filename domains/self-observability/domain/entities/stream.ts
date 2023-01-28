import { createId } from '@paralleldrive/cuid2'

export interface Stream {
  id: string
  createdAt: Date
  sloId: string
  source: string
}

export const createStream = ({ id = createId(), createdAt = new Date(), sloId = '', source = 'manual' }): Stream => ({
  id,
  createdAt,
  sloId,
  source,
})
