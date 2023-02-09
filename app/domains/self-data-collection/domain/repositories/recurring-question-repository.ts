import { RecurringQuestion } from '../entities/recurring-question'

export interface RecurringQuestionRepositoryAPI {
  create(recurringQuestion: RecurringQuestion): Promise<RecurringQuestion>
  read(id: string): Promise<RecurringQuestion | null>
  readAll(): Promise<RecurringQuestion[]>
  update(id: string, recurringQuestion: Partial<RecurringQuestion>): Promise<RecurringQuestion>
  delete(id: string): Promise<RecurringQuestion>
}
