import { db } from '~/database.server'
import type { Answer } from '../domain/entities/answer'

export interface AnswerRepositoryAPI {
  create(answer: Answer): Promise<Answer>
  read(id: string): Promise<Answer | null>
  readAll(): Promise<Answer[]>
  update(id: string, partialAnswer: Partial<Answer>): Promise<Answer>
  delete(id: string): Promise<Answer>
}

export const AnswerRepository = (): AnswerRepositoryAPI => ({
  create: async answer =>
    db.answer.create({
      data: answer,
    }),
  read: async id => db.answer.findUnique({ where: { id } }),
  readAll: db.answer.findMany,
  update: async (id, answer) => db.answer.update({ where: { id }, data: answer }),
  delete: async id => db.answer.delete({ where: { id } }),
})
