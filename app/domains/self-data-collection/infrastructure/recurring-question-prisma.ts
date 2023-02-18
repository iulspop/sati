import { db } from '../../db.server'
import { RecurringQuestionRepositoryAPI } from '../domain/repositories/recurring-question-repository'

export const RecurringQuestionRepository = (): RecurringQuestionRepositoryAPI => ({
  create: async ({ id, order, question, phase: { timestamp, utcOffsetInMinutes } = {} }) =>
    db.recurringQuestion
      .create({
        data: {
          id,
          order,
          question,
          timestamp,
          utcOffsetInMinutes,
        },
      })
      .then(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
        id,
        order,
        question,
        phase: {
          timestamp,
          utcOffsetInMinutes,
        },
      })),
  read: async id =>
    db.recurringQuestion.findUnique({ where: { id } }).then(recurringQuestion => {
      if (!recurringQuestion) return null
      const { id, order, question, timestamp, utcOffsetInMinutes } = recurringQuestion
      return {
        id,
        order,
        question,
        phase: {
          timestamp,
          utcOffsetInMinutes,
        },
      }
    }),
  readAll: async () =>
    db.recurringQuestion
      .findMany({
        orderBy: {
          order: 'asc',
        },
      })
      .then(recurringQuestions =>
        recurringQuestions.map(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
          id,
          order,
          question,
          phase: {
            timestamp,
            utcOffsetInMinutes,
          },
        }))
      ),
  update: async (id, { order, question, phase: { timestamp, utcOffsetInMinutes } = {} }) =>
    db.recurringQuestion
      .update({
        where: { id },
        data: {
          order,
          question,
          timestamp,
          utcOffsetInMinutes,
        },
      })
      .then(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
        id,
        order,
        question,
        phase: {
          timestamp,
          utcOffsetInMinutes,
        },
      })),
  delete: async id =>
    db.recurringQuestion.delete({ where: { id } }).then(({ id, order, question, timestamp, utcOffsetInMinutes }) => ({
      id,
      order,
      question,
      phase: {
        timestamp,
        utcOffsetInMinutes,
      },
    })),
})
