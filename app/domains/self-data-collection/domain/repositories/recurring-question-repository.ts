import { RecurringQuestion } from '../entities/recurring-question'

export interface RecurringQuestionRepositoryAPI {
  findMany(): Promise<RecurringQuestion[]>
  create(recurringQuestion: RecurringQuestion): Promise<void>
}
