import StreamRepositoryAPI from '../domain/repositories/stream-repository'
import db from '../../db.server'

export const StreamRepository = (): StreamRepositoryAPI => ({
  create: async stream => await db.stream.create({ data: stream }),
  read: async id => (id ? await db.stream.findUnique({ where: { id } }) : await db.stream.findMany()),
  update: async (id, stream) => await db.stream.update({ where: { id }, data: stream }),
  delete: async id => await db.stream.delete({ where: { id } }),
})
