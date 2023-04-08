import { Answers } from '~/domains/self-data-collection/domain'
import type { InquireRepositoryAPI } from '../domain/repositories/inquire-repository'

export const eventRepository: InquireRepositoryAPI = {
  getAnswers: Answers.readAll,
}
