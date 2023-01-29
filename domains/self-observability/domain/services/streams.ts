import { createEvent, Event } from '../entities/event'
import { createStream, Stream } from '../entities/stream'
import { EventRepositoryAPI } from '../repositories/event-repository'
import { StreamRepositoryAPI } from '../repositories/stream-repository'

interface StreamsAPI {
  create: (partialSLO: Partial<Stream>) => Promise<Stream>
  read: (id?: string) => Promise<Stream | Stream[] | null>
  update: (id: string, partialSLO: Partial<Stream>) => Promise<Stream>
  delete: (id: string) => Promise<Stream>
  appendEvent: (event: any) => Promise<string>
  readEvents: (id: string) => Promise<Event[]>
}

export const Streams =
  (streamRepository: StreamRepositoryAPI) =>
  (eventRepository: EventRepositoryAPI): StreamsAPI => ({
    create: async partialStream => {
      const stream = await streamRepository.create(createStream(partialStream))
      // cacheEvents(stream)
      return stream
    },
    read: async id => streamRepository.read(id),
    update: async (id, partialStream) => streamRepository.update(id, partialStream),
    delete: async id => streamRepository.delete(id),
    appendEvent: async eventData => {
      // @ts-ignore
      const streams: Stream[] = await streamRepository.read()
      const stream = streams.find(stream => stream.source === eventData.questionId)
      if (!stream) return '-1'
      await eventRepository.append(createEvent({ streamId: stream.id, data: eventData }))
      return stream.id
    },
    readEvents: async id => eventRepository.readAll(id),
  })
