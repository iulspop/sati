import { SLO } from '../entities/slo'

export default interface SLORepositoryAPI {
  create(slo: SLO): Promise<SLO>
}
