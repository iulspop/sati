import RecurringQuestionRepository from '../domain/repositories/recurring-question-repository.js'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function recurringQuestionRepositoryDatabase(): RecurringQuestionRepository {
  return {
    findMany: async () => {
      try {
        const recurringQuestions = await prisma.recurringQuestion.findMany();
        const mappedRecurringQuestions = recurringQuestions.map(recurringQuestion => {
          return {
            id: recurringQuestion.id,
            question: recurringQuestion.question,
            phases: [{
              timestamp: new Date(recurringQuestion.timestamp),
              utcOffsetInMinutes: recurringQuestion.utcOffsetInMinutes
            }]
          }
        })
        await prisma.$disconnect();
        return new Promise((resolve, reject) => {
          resolve(mappedRecurringQuestions);
        });
      } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      }
    },
    create: async (recurringQuestion) => {
      try {
        await prisma.recurringQuestion.create({
          data: {
            question: recurringQuestion.question,
            timestamp: recurringQuestion.phases[0].timestamp,
            utcOffsetInMinutes: recurringQuestion.phases[0].utcOffsetInMinutes
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
