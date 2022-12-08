// import prisma from './prisma-client';

import AnswerRepository from '../domain/repositories/answer-repository';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function answerRepositoryDatabase(): AnswerRepository {
  return {
    findMany: async () => {
      try {
        const answers = await prisma.answer.findMany();
        // const mappedRecurringQuestions = recurringQuestions.map(recurringQuestion => {
        //   return {
        //     id: recurringQuestion.id,
        //     question: recurringQuestion.question,
        //     phases: [{
        //       timestamp: new Date(recurringQuestion.timestamp),
        //       utcOffsetInMinutes: recurringQuestion.utcOffsetInMinutes
        //     }]
        //   }
        // })
        await prisma.$disconnect();
        return new Promise((resolve, reject) => {
          resolve(answers);
        });
      } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      }
    },
    create: async (answer) => {
      try {
        await prisma.answer.create({
          data: {
            questionId: answer.questionId,
            response: answer.response,
            timestamp: new Date(answer.timestamp)
          }
        })
        await prisma.$disconnect();
      } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      }
    }
  }
}
