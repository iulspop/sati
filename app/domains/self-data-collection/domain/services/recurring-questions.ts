import { asyncPipe } from '~/utils/async-pipe'
import { RecurringQuestion, recurringQuestionFactory } from '../entities/recurring-question'
import { RecurringQuestionRepositoryAPI } from '../repositories/recurring-question-repository'

export interface RecurringQuestionsAPI {
  create: (partialSLO: Partial<RecurringQuestion>) => Promise<RecurringQuestion>
  read: (id: string) => Promise<RecurringQuestion | null>
  readAll: () => Promise<RecurringQuestion[]>
  update: (id: string, partialSLO: Partial<RecurringQuestion>) => Promise<RecurringQuestion>
  delete: (id: string) => Promise<RecurringQuestion>
}

export const RecurringQuestions = (
  RecurringQuestionRepository: RecurringQuestionRepositoryAPI
): RecurringQuestionsAPI => ({
  create: asyncPipe(recurringQuestionFactory, RecurringQuestionRepository.create),
  read: RecurringQuestionRepository.read,
  readAll: RecurringQuestionRepository.readAll,
  update: RecurringQuestionRepository.update,
  delete: RecurringQuestionRepository.delete,
})
