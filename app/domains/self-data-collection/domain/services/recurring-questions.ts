import { RecurringQuestion, recurringQuestionFactory } from '../entities/recurring-question'
import { RecurringQuestionRepositoryAPI } from '../repositories/recurring-question-repository'

export interface RecurringQuestionsAPI {
  create: (partialRecurringQuestion: Partial<RecurringQuestion>) => Promise<RecurringQuestion>
  read: (id: string) => Promise<RecurringQuestion | null>
  readAll: () => Promise<RecurringQuestion[]>
  update: (id: string, partialRecurringQuestion: Partial<RecurringQuestion>) => Promise<RecurringQuestion>
  delete: (id: string) => Promise<RecurringQuestion>
}

export const RecurringQuestions = (
  RecurringQuestionRepository: RecurringQuestionRepositoryAPI
): RecurringQuestionsAPI => ({
  create: async partialRecurringQuestion => {
    if ('order' in partialRecurringQuestion)
      return await RecurringQuestionRepository.create(recurringQuestionFactory(partialRecurringQuestion))

    const recurringQuestions = await RecurringQuestionRepository.readAll()
    const lastOrder = recurringQuestions.reduce((max, recurringQuestion) => Math.max(max, recurringQuestion.order), -1)

    return RecurringQuestionRepository.create(
      recurringQuestionFactory({ ...partialRecurringQuestion, order: lastOrder + 1 })
    )
  },
  read: RecurringQuestionRepository.read,
  readAll: RecurringQuestionRepository.readAll,
  update: RecurringQuestionRepository.update,
  delete: RecurringQuestionRepository.delete,
})
