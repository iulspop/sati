import { createStream, Stream } from '../entities/stream'
import StreamRepositoryAPI from '../repositories/stream-repository'

interface StreamsAPI {
  create: (partialSLO: Partial<Stream>) => Promise<Stream>
  // read: (id?: string) => Promise<Stream | Stream[] | null>
  // update: (id: string, partialSLO: Partial<Stream>) => Promise<Stream>
  // delete: (id: string) => Promise<Stream>
}

export const Streams = (streamRepository: StreamRepositoryAPI): StreamsAPI => ({
  create: async partialStream => streamRepository.create(createStream(partialStream)),
})
