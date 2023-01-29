import { Event, eventFactory } from '../entities/event'
import { Stream, streamFactory } from '../entities/stream'
import { EventRepositoryAPI } from '../repositories/event-repository'
import { InquireRepositoryAPI } from '../repositories/inquire-repository'
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
  (inquireRepository: InquireRepositoryAPI) =>
  (streamRepository: StreamRepositoryAPI) =>
  (eventRepository: EventRepositoryAPI): StreamsAPI => ({
    create: async partialStream => {
      const stream = await streamRepository.create(streamFactory(partialStream))
      await cacheEvents(inquireRepository)(eventRepository)(stream)
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
      await eventRepository.append(eventFactory({ streamId: stream.id, data: eventData }))
      return stream.id
    },
    readEvents: async id => eventRepository.readAll(id),
  })

const cacheEvents =
  (inquireRepository: InquireRepositoryAPI) => (eventRepository: EventRepositoryAPI) => async (stream: Stream) => {
    let answers = await inquireRepository.getAnswers()

    await Promise.all(
      answers
        .filter(answer => answer.questionId === stream.source)
        .map(answer => eventFactory({ streamId: stream.id, data: answer }))
        .map(event => eventRepository.append(event))
    )
  }
