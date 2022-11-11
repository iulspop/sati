import RecurringQuestion from '../entities/recurring-question'

export default interface RecurringQuestionRepository {
  findMany(): Promise<Array<RecurringQuestion>>
  create(reucrringQuestion: RecurringQuestion): Promise<void>
}
