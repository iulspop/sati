import { db } from '~/database.server'
import type { RecurringQuestion } from '../domain/entities/recurring-question'

export interface RecurringQuestionRepositoryAPI {
  create(recurringQuestion: RecurringQuestion): Promise<RecurringQuestion>
  read(id: string): Promise<RecurringQuestion | null>
  readAll(userId: string): Promise<RecurringQuestion[]>
  update(id: string, partialRecurringQuestion: Partial<RecurringQuestion>): Promise<RecurringQuestion>
  delete(id: string): Promise<RecurringQuestion>
}

export const RecurringQuestionRepository = (): RecurringQuestionRepositoryAPI => ({
  create: async ({ id, userId, order, text, timestamp, utcOffsetInMinutes }) =>
    db.recurringQuestion.create({
      data: {
        id,
        userId,
        order,
        text,
        timestamp,
        utcOffsetInMinutes,
      },
    }),
  read: async id => db.recurringQuestion.findUnique({ where: { id } }),
  readAll: async userId =>
    db.recurringQuestion.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc',
      },
    }),
  update: async (id, { order, text, timestamp, utcOffsetInMinutes }) =>
    db.recurringQuestion.update({
      where: { id },
      data: {
        order,
        text,
        timestamp,
        utcOffsetInMinutes,
      },
    }),
  delete: async id => db.recurringQuestion.delete({ where: { id } }),
})
