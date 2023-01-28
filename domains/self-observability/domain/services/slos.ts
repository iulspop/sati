import { SLO, createSLO } from '../entities/slo'
import SLORepositoryAPI from '../repositories/slo-repository'

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

export const Points = () => ({
  // - read(streamId) => Point[]
  //    - gets all data points
  // - append(event) => void
  //    - only update would be append data point
  //    - if the update is only an event, how do I know what Stream to update?
  //       if the sources matches, then it's the same stream
  //       source is question id
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
