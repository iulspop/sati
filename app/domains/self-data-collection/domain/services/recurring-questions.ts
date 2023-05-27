import type { RecurringQuestionRepositoryAPI } from '../../infrastructure/recurring-question-repository.server'
import type { CreateRecurringQuestionCommand, RecurringQuestion } from '../entities/recurring-question'
import { recurringQuestionFactory } from '../entities/recurring-question'
export interface RecurringQuestionsAPI {
  create: (partialRecurringQuestion: CreateRecurringQuestionCommand) => Promise<RecurringQuestion>
  read: (id: string) => Promise<RecurringQuestion | null>
  readAll: (userId: string) => Promise<RecurringQuestion[]>
  update: (id: string, partialRecurringQuestion: Partial<RecurringQuestion>) => Promise<RecurringQuestion>
  delete: (id: string) => Promise<RecurringQuestion>
}

export const RecurringQuestions = (
  RecurringQuestionRepository: RecurringQuestionRepositoryAPI
): RecurringQuestionsAPI => ({
  create: async partialRecurringQuestion => {
    if ('order' in partialRecurringQuestion)
      return await RecurringQuestionRepository.create(recurringQuestionFactory(partialRecurringQuestion))

    const recurringQuestions = await RecurringQuestionRepository.readAll(partialRecurringQuestion.userId)
    const lastOrder = recurringQuestions.reduce((max, recurringQuestion) => Math.max(max, recurringQuestion.order), -1)

    return RecurringQuestionRepository.create(
      recurringQuestionFactory({ ...partialRecurringQuestion, order: lastOrder + 1 })
    )
  },
  read: RecurringQuestionRepository.read,
  readAll: async userId => {
    if (!userId) throw new Error('missing userId')
    return await RecurringQuestionRepository.readAll(userId)
  },
  update: RecurringQuestionRepository.update,
  delete: RecurringQuestionRepository.delete,
})
