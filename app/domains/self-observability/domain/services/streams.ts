import { asyncPipe } from '~/utils/async-pipe'
import { asyncTap } from '~/utils/async-tap'

import type { Event} from '../entities/event';
import { eventFactory } from '../entities/event'
import type { Stream} from '../entities/stream';
import { streamFactory } from '../entities/stream'
import type { EventRepositoryAPI } from '../repositories/event-repository'
import type { InquireRepositoryAPI } from '../repositories/inquire-repository'
import type { StreamRepositoryAPI } from '../repositories/stream-repository'

export interface StreamsAPI {
  create: (partialSLO: Partial<Stream>) => Promise<Stream>
  read: (id: string) => Promise<Stream | null>
  readAll: () => Promise<Stream[]>
  update: (id: string, partialSLO: Partial<Stream>) => Promise<Stream>
  delete: (id: string) => Promise<Stream>
  findBySLOId: (sloId: string) => Promise<Stream | null>
  appendEvent: (eventData: any) => Promise<string>
  readEvents: (streamId: string) => Promise<Event[]>
}

export const Streams =
  (inquireRepository: InquireRepositoryAPI) =>
  (streamRepository: StreamRepositoryAPI) =>
  (eventRepository: EventRepositoryAPI): StreamsAPI => ({
    create: asyncPipe(
      streamFactory,
      streamRepository.create,
      asyncTap(cacheEvents(inquireRepository)(eventRepository))
    ),
    read: streamRepository.read,
    readAll: streamRepository.readAll,
    update: streamRepository.update,
    delete: streamRepository.delete,
    findBySLOId: streamRepository.findBySLOId,
    appendEvent: async eventData => {
      const streams = await streamRepository.readAll()
      const stream = streams.find(stream => stream.source === eventData.questionId)
      await eventRepository.append(eventFactory({ streamId: stream.id, data: eventData }))
      return stream.id
    },
    readEvents: eventRepository.readAllByStream,
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
