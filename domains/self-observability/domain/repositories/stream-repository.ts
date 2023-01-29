import { Stream } from '../entities/stream'
export interface StreamRepositoryAPI {
  create(stream: Stream): Promise<Stream>
  read(id?: string): Promise<Stream | Stream[] | null>
  update(id: string, stream: Partial<Stream>): Promise<Stream>
  delete(id: string): Promise<Stream>
}
