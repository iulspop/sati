import RecurringQuestionRepository from '../domain/repositories/recurring-question-repository.js'
import prisma from './db.server.js'

export default function recurringQuestionRepositoryDatabase(): RecurringQuestionRepository {
  return {
    findMany: async () => {
      const recurringQuestions = await prisma.recurringQuestion.findMany({ orderBy: { order: 'asc' } })
      return recurringQuestions.map(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
        id,
        order,
        question,
        phases: [
          {
            timestamp: new Date(timestamp),
            utcOffsetInMinutes: utcOffsetInMinutes,
          },
        ],
      }))
    },
    create: async ({ id, order, question, phases }) => {
      await prisma.recurringQuestion.create({
        data: {
          id,
          order,
          question,
          timestamp: phases[0].timestamp,
          utcOffsetInMinutes: phases[0].utcOffsetInMinutes,
        },
      })
    },
  }
}
