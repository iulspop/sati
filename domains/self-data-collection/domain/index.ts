import answerRepositoryDatabase from '../infrastructure/answer-prisma.js'
import recurringQuestionRepositoryDatabase from '../infrastructure/recurring-question-prisma.js'
import { PromptQueue } from './services/prompt-queue.js'

export const promptQueue = PromptQueue(recurringQuestionRepositoryDatabase())(answerRepositoryDatabase())
