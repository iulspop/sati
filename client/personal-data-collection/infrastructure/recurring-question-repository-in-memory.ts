import { RecurringQuestion, createRecurringQuestion } from '../domain/entities/recurring-question'
import RecurringQuestionRepository from '../domain/repositories/recurring-question-repository'

export default function recurringQuestionRepositoryInMemory(): RecurringQuestionRepository {
  let recurringQuestions: RecurringQuestion[] = []

  return {
    async findMany() {
      return recurringQuestions
    },
    async create(recurringQuestion: RecurringQuestion) {
      recurringQuestions = [...recurringQuestions, createRecurringQuestion(recurringQuestion)]
    },
  }
}
