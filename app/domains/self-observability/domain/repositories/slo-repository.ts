import { SLO } from '../entities/slo'

export interface SLORepositoryAPI {
  create(slo: SLO): Promise<SLO>
  read(id: string): Promise<SLO | null>
  readAll(): Promise<SLO[]>
  update(id: string, slo: Partial<SLO>): Promise<SLO>
  delete(id: string): Promise<SLO>
}
