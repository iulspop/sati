import type { Stream } from '../entities/stream'
export interface StreamRepositoryAPI {
  create(stream: Stream): Promise<Stream>
  read(id: string): Promise<Stream | null>
  readAll(): Promise<Stream[]>
  update(id: string, stream: Partial<Stream>): Promise<Stream>
  delete(id: string): Promise<Stream>
  findBySLOId(sloId: string): Promise<Stream | null>
}
