import { asyncPipe } from '~/utils/async-pipe'
import type { AnswerRepositoryAPI } from '../../infrastructure/answer-repository.server'
import type { Answer } from '../entities/answer'
import { answerFactory } from '../entities/answer'
export interface AnswersAPI {
  create: (partialAnswer: Partial<Answer>) => Promise<Answer>
  read: (id: string) => Promise<Answer | null>
  readAll: (userId: string) => Promise<Answer[]>
  update: (id: string, partialAnswer: Partial<Answer>) => Promise<Answer>
  delete: (id: string) => Promise<Answer>
}

export const Answers = (AnswerRepository: AnswerRepositoryAPI): AnswersAPI => ({
  create: asyncPipe(answerFactory, AnswerRepository.create),
  read: AnswerRepository.read,
  readAll: AnswerRepository.readAll,
  update: AnswerRepository.update,
  delete: AnswerRepository.delete,
})
