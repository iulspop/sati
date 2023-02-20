import { db } from '~/database.server'

import type { SLORepositoryAPI } from '../domain/repositories/slo-repository'

export const SLORepository = (): SLORepositoryAPI => ({
  create: async slo => await db.slo.create({ data: slo }),
  read: async id => db.slo.findUnique({ where: { id } }),
  readAll: async () => await db.slo.findMany(),
  update: async (id, slo) => await db.slo.update({ where: { id }, data: slo }),
  delete: async id => await db.slo.delete({ where: { id } }),
})
