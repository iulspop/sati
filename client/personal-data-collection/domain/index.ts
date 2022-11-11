import answerRepositoryInMemory from '../infrastructure/answer-repository-in-memory'
import recurringQuestionRepositoryInMemory from '../infrastructure/recurring-question-repository-in-memory'
import { PromptQueue } from './usecases/prompt-queue'

export const promptQueue = PromptQueue(answerRepositoryInMemory())(recurringQuestionRepositoryInMemory())
