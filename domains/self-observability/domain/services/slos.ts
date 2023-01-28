import { SLO, createSLO } from '../entities/slo'
import SLORepositoryAPI from '../repositories/slo-repository'

interface SLOsAPI {
  create: (partialSLO: Partial<SLO>) => Promise<SLO>
  read: (id?: string) => Promise<SLO | SLO[] | null>
  update: (id: string, partialSLO: Partial<SLO>) => Promise<SLO>
  delete: (id: string) => Promise<SLO>
  /*
  // - create({ name, denominatorLabel, denominator, targetPercentage, interpreter }) => SLO
        // - SLO contains info for how to interpret data points into results
        // - It has one stream associated with it
        // - It can map stream data points to SLO results
        // - SLO results are used to calculate SLO status (percentage, budget, etc)
  // - read(sloId?) => SLO | SLO[]
  // - update(sloId), { name, denominatorLabel, denominator, targetPercentage }) => SLO
  // - delete(sloId) => SLO
  */
}

export const SLOs = (SLORepository: SLORepositoryAPI): SLOsAPI => ({
  create: async partialSLO => await SLORepository.create(createSLO(partialSLO)),
  read: async id => await SLORepository.read(id),
  update: async (id, partialSLO) => await SLORepository.update(id, partialSLO),
  delete: async id => await SLORepository.delete(id),
})

export const Streams = () => ({
  /*
  - create(sloId, source) => Stream
     - when created, stream is associated with an SLO
     - when I create, I say go load data from this source
          - there should be one repository that can interpret different sources and load data
            - right now it would just be an id of a question from inquire, then fetches all the answers
     - then additional data is added through events
  - read(streamId?) => Stream | Stream[]
  - update(streamId, source) => Stream
  - delete(streamId) => Stream
  */
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
