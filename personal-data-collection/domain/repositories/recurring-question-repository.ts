import RecurringQuestion from '../entities/recurring-question'

export default interface RecurringQuestionRepository {
  findMany(): Promise<RecurringQuestion[]>
  create(recurringQuestion: RecurringQuestion): Promise<void>
}
