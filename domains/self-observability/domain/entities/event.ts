import { createId } from '@paralleldrive/cuid2'

export interface Event {
  id: string
  streamId: string
  createdAt: Date
  data: any
}

export const createEvent = ({ id = createId(), streamId = '', createdAt = new Date(), data = {} }): Event => ({
  id,
  streamId,
  createdAt,
  data,
})
