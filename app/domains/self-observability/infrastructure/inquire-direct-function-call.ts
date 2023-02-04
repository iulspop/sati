import { promptQueue } from '~/domains/self-data-collection/domain'
import { InquireRepositoryAPI } from '../domain/repositories/inquire-repository'

export const eventRepository: InquireRepositoryAPI = {
  getAnswers: promptQueue.getAnswers,
}
