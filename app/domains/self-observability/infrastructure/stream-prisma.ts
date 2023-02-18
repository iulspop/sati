import { database } from '../../database.server'
import type { StreamRepositoryAPI } from '../domain/repositories/stream-repository'

export const StreamRepository = (): StreamRepositoryAPI => ({
  create: async stream => await database.stream.create({ data: stream }),
  read: async id => await database.stream.findUnique({ where: { id } }),
  readAll: async () => await database.stream.findMany(),
  update: async (id, stream) => await database.stream.update({ where: { id }, data: stream }),
  delete: async id => await database.stream.delete({ where: { id } }),
  findBySLOId: async sloId => await database.stream.findUnique({ where: { sloId } }),
})
