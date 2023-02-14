import { AnswerRepository } from '../infrastructure/answer-prisma.js'
import { RecurringQuestionRepository } from '../infrastructure/recurring-question-prisma.js'
import { Answers as Answers_ } from './services/answers.js'
import { PromptQueue as PromptQueue_ } from './services/prompt-queue.js'
import { RecurringQuestions as RecurringQuestions_ } from './services/recurring-questions.js'

export const RecurringQuestions = RecurringQuestions_(RecurringQuestionRepository())
export const Answers = Answers_(AnswerRepository())
export const PromptQueue = PromptQueue_(RecurringQuestions)(Answers)
