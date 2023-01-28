import { SLO } from '../entities/slo'

export default interface SLORepositoryAPI {
  create(slo: SLO): Promise<SLO>
  read(id?: string): Promise<SLO> | Promise<SLO[]> | null
  update(id: string, slo: Partial<SLO>): Promise<SLO>
  delete(id: string): Promise<SLO>
}
