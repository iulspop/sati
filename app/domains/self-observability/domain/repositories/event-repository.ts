import type { Event } from '../entities/event'

export interface EventRepositoryAPI {
  append(event: Event): Promise<Event>
  readAllByStream(streamId: string): Promise<Event[]>
}
