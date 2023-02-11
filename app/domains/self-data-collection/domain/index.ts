import { AnswerRepository } from '../infrastructure/answer-prisma.js'
import { RecurringQuestionRepository } from '../infrastructure/recurring-question-prisma.js'
import { Answers } from './services/answers.js'
import { PromptQueue } from './services/prompt-queue.js'
import { RecurringQuestions } from './services/recurring-questions.js'

export const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
export const answers = Answers(AnswerRepository())
export const promptQueue = PromptQueue(recurringQuestions)(answers)
