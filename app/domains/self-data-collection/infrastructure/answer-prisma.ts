import db from '../../db.server.js'
import { AnswerRepositoryAPI } from '../domain/repositories/answer-repository.js'

export const AnswerRepository = (): AnswerRepositoryAPI => ({
  findMany: async () => await db.answer.findMany(),
  create: async answer => {
    await db.answer.create({
      data: {
        id: answer.id,
        questionId: answer.questionId,
        response: answer.response,
        timestamp: answer.timestamp,
      },
    })
  },
})
