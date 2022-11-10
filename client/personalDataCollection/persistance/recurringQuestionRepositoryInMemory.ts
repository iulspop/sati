import RecurringQuestion from '../domain/entities/recurringQuestion'
import RecurringQuestionRepository from '../domain/repositories/recurringQuestionRepository'

export default function recurringQuestionRepositoryInMemory(): RecurringQuestionRepository {
  let recurringQuestions: RecurringQuestion[] = []

  return {
    async findAll() {
      return recurringQuestions
    },
    async save(recurringQuestion: RecurringQuestion) {
      recurringQuestions = [...recurringQuestions, recurringQuestion]
    },
  }
}
