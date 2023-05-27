import { db } from '~/database.server'
import type { RecurringQuestionRepositoryAPI } from '../domain/repositories/recurring-question-repository'

export const RecurringQuestionRepository = (): RecurringQuestionRepositoryAPI => ({
  create: async ({ id, userId, order, question, phase: { timestamp, utcOffsetInMinutes } = {} }) =>
    db.recurringQuestion
      .create({
        data: {
          id,
          userId,
          order,
          question,
          timestamp,
          utcOffsetInMinutes,
        },
      })
      .then(({ id, userId, order, question, timestamp, utcOffsetInMinutes }) => ({
        userId,
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
      const { id, userId, order, question, timestamp, utcOffsetInMinutes } = recurringQuestion
      return {
        userId,
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
        recurringQuestions.map(({ id, userId, order, question, timestamp, utcOffsetInMinutes }) => ({
          id,
          userId,
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
      .then(({ id, userId, order, question, timestamp, utcOffsetInMinutes }) => ({
        id,
        userId,
        order,
        question,
        phase: {
          timestamp,
          utcOffsetInMinutes,
        },
      })),
  delete: async id =>
    db.recurringQuestion
      .delete({ where: { id } })
      .then(({ id, userId, order, question, timestamp, utcOffsetInMinutes }) => ({
        id,
        userId,
        order,
        question,
        phase: {
          timestamp,
          utcOffsetInMinutes,
        },
      })),
})
