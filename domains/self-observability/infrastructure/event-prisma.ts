import db from '../../db.server'
import { EventRepositoryAPI } from '../domain/repositories/event-repository'

export const EventRepository = (): EventRepositoryAPI => ({
  append: async event =>
    await db.event.create({
      data: {
        ...event,
        data: JSON.stringify(event.data),
      },
    }),
  readAll: async streamId =>
    db.event
      .findMany({ where: { streamId }, orderBy: { createdAt: 'desc' } })
      .then(events => events.map(event => ({ ...event, data: JSON.parse(event.data) }))),
})
