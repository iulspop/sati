import { PromptQueue } from './usecases/prompt-queue'
import answerRepositoryInMemory from '../infrastructure/answer-repository-in-memory'
import recurringQuestionRepositoryInMemory from '../infrastructure/recurring-question-repository-in-memory'

export const promptQueue = PromptQueue(recurringQuestionRepositoryInMemory())(answerRepositoryInMemory())
