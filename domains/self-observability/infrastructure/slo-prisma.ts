import SLORepositoryAPI from '../domain/repositories/slo-repository'
import prisma from '../../db.server'

export const SLORepository = (): SLORepositoryAPI => ({
  create: async slo => await prisma.slo.create({ data: { ...slo } }),
  read: async id => (id ? await prisma.slo.findUnique({ where: { id } }) : await prisma.slo.findMany()),
})
