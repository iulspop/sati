import RecurringQuestionRepository from '../domain/repositories/recurring-question-repository.js'
import prisma from './prisma-client.js'

export default function recurringQuestionRepositoryDatabase(): RecurringQuestionRepository {
  return {
    findMany: async () => {
      const recurringQuestions = await prisma.recurringQuestion.findMany()
      return recurringQuestions.map(recurringQuestion => {
        return {
          id: recurringQuestion.id,
          question: recurringQuestion.question,
          phases: [
            {
              timestamp: new Date(recurringQuestion.timestamp),
              utcOffsetInMinutes: recurringQuestion.utcOffsetInMinutes,
            },
          ],
        }
      })
    },
    create: async recurringQuestion => {
      await prisma.recurringQuestion.create({
        data: {
          id: recurringQuestion.id,
          question: recurringQuestion.question,
          timestamp: recurringQuestion.phases[0].timestamp,
          utcOffsetInMinutes: recurringQuestion.phases[0].utcOffsetInMinutes,
        },
      })
    },
  }
}
