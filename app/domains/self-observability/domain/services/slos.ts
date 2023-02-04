import { SLO, sloFactory } from '../entities/slo'
import { SLORepositoryAPI } from '../repositories/slo-repository'

export interface SLOsAPI {
  create: (partialSLO: Partial<SLO>) => Promise<SLO>
  read: (id: string) => Promise<SLO | null>
  readAll: () => Promise<SLO[]>
  update: (id: string, partialSLO: Partial<SLO>) => Promise<SLO>
  delete: (id: string) => Promise<SLO>
}

export const SLOs = (SLORepository: SLORepositoryAPI): SLOsAPI => ({
  create: async partialSLO => await SLORepository.create(sloFactory(partialSLO)),
  read: SLORepository.read,
  readAll: SLORepository.readAll,
  update: SLORepository.update,
  delete: SLORepository.delete,
})
