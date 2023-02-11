import { answers } from '~/domains/self-data-collection/domain'
import { InquireRepositoryAPI } from '../domain/repositories/inquire-repository'

export const eventRepository: InquireRepositoryAPI = {
  getAnswers: answers.readAll,
}
