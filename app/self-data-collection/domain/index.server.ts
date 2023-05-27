import { AnswerRepository } from '../infrastructure/answer-repository.server'
import { RecurringQuestionRepository } from '../infrastructure/recurring-question-repository.server'
import { Answers as Answers_ } from './services/answers'
import { PromptQueue as PromptQueue_ } from './services/prompt-queue'
import { RecurringQuestions as RecurringQuestions_ } from './services/recurring-questions'

export const RecurringQuestions = RecurringQuestions_(RecurringQuestionRepository())
export const Answers = Answers_(AnswerRepository())
export const PromptQueue = PromptQueue_(RecurringQuestions)(Answers)
