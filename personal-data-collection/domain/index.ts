import { PromptQueue } from './services/prompt-queue.js'
import recurringQuestionRepositoryDatabase from '../infrastructure/recurring-question-prisma.js'
import answerRepositoryDatabase from '../infrastructure/answer-prisma.js'

export const promptQueue = PromptQueue(recurringQuestionRepositoryDatabase())(
  answerRepositoryDatabase()
)
