import { AnswerRepository } from '../infrastructure/answer-repository.server'
import { RecurringQuestionRepository } from '../infrastructure/recurring-question-repository.server'
import { AnswersService } from './services/answers'
import { PromptQueueService } from './services/prompt-queue'
import { RecurringQuestionsService } from './services/recurring-questions'

export const recurringQuestionsService = RecurringQuestionsService(RecurringQuestionRepository())
export const answersService = AnswersService(AnswerRepository())
export const promptQueueService = PromptQueueService(recurringQuestionsService)(answersService)
