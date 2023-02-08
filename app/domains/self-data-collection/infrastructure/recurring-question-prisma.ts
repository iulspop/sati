import db from '../../db.server'
import { RecurringQuestionRepositoryAPI } from '../domain/repositories/recurring-question-repository'

export const RecurringQuestionRepository = (): RecurringQuestionRepositoryAPI => ({
  findMany: async () => {
    const recurringQuestions = await db.recurringQuestion.findMany({ orderBy: { order: 'asc' } })
    return recurringQuestions.map(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
      id,
      order,
      question,
      phase: {
        timestamp: new Date(timestamp),
        utcOffsetInMinutes: utcOffsetInMinutes,
      },
    }))
  },
  create: async ({ id, order, question, phase }) => {
    await db.recurringQuestion.create({
      data: {
        id,
        order,
        question,
        timestamp: phase.timestamp,
        utcOffsetInMinutes: phase.utcOffsetInMinutes,
      },
    })
  },
})
