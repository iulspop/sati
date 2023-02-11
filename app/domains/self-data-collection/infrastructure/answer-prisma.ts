import db from '../../db.server.js'
import { AnswerRepositoryAPI } from '../domain/repositories/answer-repository.js'

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
