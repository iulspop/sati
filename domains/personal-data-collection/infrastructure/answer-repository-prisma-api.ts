import AnswerRepository from '../domain/repositories/answer-repository.js'
import prisma from './prisma-client.js'

export default function answerRepositoryDatabase(): AnswerRepository {
  return {
    findMany: async () => await prisma.answer.findMany(),
    create: async answer => {
      await prisma.answer.create({
        data: {
          id: answer.id,
          questionId: answer.questionId,
          response: answer.response,
          timestamp: answer.timestamp,
        },
      })
    },
  }
}
