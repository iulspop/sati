import { PromptQueue } from './usecases/prompt-queue.js'
import recurringQuestionRepositoryDatabase from '../infrastructure/recurring-question-prisma-api.js'
import answerRepositoryDatabase from '../infrastructure/answer-repository-prisma-api.js'

export const promptQueue = PromptQueue(recurringQuestionRepositoryDatabase())(answerRepositoryDatabase())
