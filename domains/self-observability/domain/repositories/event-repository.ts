import { Event } from '../entities/event'

export interface EventRepositoryAPI {
  append(event: Event): Promise<Event>
  readAll(streamId: string): Promise<Event[]>
}
