import RecurringQuestion from '../entities/recurringQuestion'

export default interface RecurringQuestionRepository {
  findAll(): Promise<Array<RecurringQuestion>>
  save(reucrringQuestion: RecurringQuestion): Promise<void>
}
