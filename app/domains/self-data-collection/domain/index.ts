import { AnswerRepository } from '../infrastructure/answer-prisma.js'
import { RecurringQuestionRepository } from '../infrastructure/recurring-question-prisma.js'
import { PromptQueue } from './services/prompt-queue.js'

export const promptQueue = PromptQueue(RecurringQuestionRepository())(AnswerRepository())
