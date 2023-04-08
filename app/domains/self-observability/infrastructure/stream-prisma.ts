import { db } from '~/database.server'
import type { StreamRepositoryAPI } from '../domain/repositories/stream-repository'

export const StreamRepository = (): StreamRepositoryAPI => ({
  create: async stream => await db.stream.create({ data: stream }),
  read: async id => await db.stream.findUnique({ where: { id } }),
  readAll: async () => await db.stream.findMany(),
  update: async (id, stream) => await db.stream.update({ where: { id }, data: stream }),
  delete: async id => await db.stream.delete({ where: { id } }),
  findBySLOId: async sloId => await db.stream.findUnique({ where: { sloId } }),
})
