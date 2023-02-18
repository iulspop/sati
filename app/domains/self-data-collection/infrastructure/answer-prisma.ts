import { database } from '../../database.server.js'
import type { AnswerRepositoryAPI } from '../domain/repositories/answer-repository.js'

export const AnswerRepository = (): AnswerRepositoryAPI => ({
  create: async answer =>
    database.answer.create({
      data: answer,
    }),
  read: async id => database.answer.findUnique({ where: { id } }),
  readAll: database.answer.findMany,
  update: async (id, answer) => database.answer.update({ where: { id }, data: answer }),
  delete: async id => database.answer.delete({ where: { id } }),
})
