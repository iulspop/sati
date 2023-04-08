import { asyncPipe } from '~/utils/async-pipe'
import type { SLO } from '../entities/slo'
import { sloFactory } from '../entities/slo'
import type { SLORepositoryAPI } from '../repositories/slo-repository'

export interface SLOsAPI {
  create: (partialSLO: Partial<SLO>) => Promise<SLO>
  read: (id: string) => Promise<SLO | null>
  readAll: () => Promise<SLO[]>
  update: (id: string, partialSLO: Partial<SLO>) => Promise<SLO>
  delete: (id: string) => Promise<SLO>
}

export const SLOs = (SLORepository: SLORepositoryAPI): SLOsAPI => ({
  create: asyncPipe(sloFactory, SLORepository.create),
  read: SLORepository.read,
  readAll: SLORepository.readAll,
  update: SLORepository.update,
  delete: SLORepository.delete,
})
