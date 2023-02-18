import { database } from '../../database.server'
import type { SLORepositoryAPI } from '../domain/repositories/slo-repository'

export const SLORepository = (): SLORepositoryAPI => ({
  create: async slo => await database.slo.create({ data: slo }),
  read: async id => database.slo.findUnique({ where: { id } }),
  readAll: async () => await database.slo.findMany(),
  update: async (id, slo) => await database.slo.update({ where: { id }, data: slo }),
  delete: async id => await database.slo.delete({ where: { id } }),
})
