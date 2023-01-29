import { createSLO, SLO } from '../entities/slo'
import { SLORepositoryAPI } from '../repositories/slo-repository'

interface SLOsAPI {
  create: (partialSLO: Partial<SLO>) => Promise<SLO>
  read: (id?: string) => Promise<SLO | SLO[] | null>
  update: (id: string, partialSLO: Partial<SLO>) => Promise<SLO>
  delete: (id: string) => Promise<SLO>
}

export const SLOs = (SLORepository: SLORepositoryAPI): SLOsAPI => ({
  create: async partialSLO => await SLORepository.create(createSLO(partialSLO)),
  read: async id => await SLORepository.read(id),
  update: async (id, partialSLO) => await SLORepository.update(id, partialSLO),
  delete: async id => await SLORepository.delete(id),
})

export const Monitors = () => ({
  /*
     - read(sloId) => Monitor

     interface Monitor {
        remainingMaxPercentage: number
        missBudget: number
        spentBudget: number
        remainingBudget: number
     }
 */
})
