import AnswerRepository from '../domain/repositories/answer-repository.js'
import prisma from './prisma-client.js'

export default function answerRepositoryDatabase(): AnswerRepository {
  return {
    findMany: async () => {
      try {
        const answers = await prisma.answer.findMany()

        // const mappedAnswers = answers.map(answer => {
        //   return {
        //     id: answer.id,
        //     question: answer.question,
        //     phases: [{
        //       timestamp: new Date(answer.timestamp),
        //       utcOffsetInMinutes: answer.utcOffsetInMinutes
        //     }]
        //   }
        // })

        await prisma.$disconnect()
        return new Promise((resolve, reject) => {
          resolve(answers)
        })
      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      }
    },
    create: async answer => {
      try {
        await prisma.answer.create({
          data: {
            questionId: answer.questionId,
            response: answer.response,
            timestamp: new Date(answer.timestamp),
          },
        })
        await prisma.$disconnect()
      } catch (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      }
    },
  }
}
