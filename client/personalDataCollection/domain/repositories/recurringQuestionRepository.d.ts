import RecurringQuestion from '../entities/recurringQuestion'

export default interface RecurringQuestionRepository {
  findMany(): Promise<Array<RecurringQuestion>>
  create(reucrringQuestion: RecurringQuestion): Promise<void>
}
