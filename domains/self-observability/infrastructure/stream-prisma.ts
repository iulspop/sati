import StreamRepositoryAPI from '../domain/repositories/stream-repository'
import db from '../../db.server'

export const StreamRepository = (): StreamRepositoryAPI => ({
  create: async stream => await db.stream.create({ data: stream }),
})
