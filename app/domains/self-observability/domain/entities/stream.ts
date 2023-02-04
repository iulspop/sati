import { createId } from '@paralleldrive/cuid2'

export interface Stream {
  id: string
  createdAt: Date
  sloId: string
  source: string
}

export const streamFactory = ({
  id = createId(),
  createdAt = new Date(),
  sloId = '',
  source = 'inquireQuestion',
}): Stream => ({
  id,
  createdAt,
  sloId,
  source,
})
