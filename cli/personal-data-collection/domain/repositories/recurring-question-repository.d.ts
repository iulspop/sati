import RecurringQuestion from '../entities/recurring-question'

export default interface RecurringQuestionRepository {
  findMany(): Array<RecurringQuestion>
  create(recurringQuestion: Partial<RecurringQuestion>)
}
