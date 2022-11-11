import answerRepositoryInMemory from '../infrastructure/answerRepositoryInMemory'
import recurringQuestionRepositoryInMemory from '../infrastructure/recurringQuestionRepositoryInMemory'
import { PromptQueue } from './usecases/promptQueue'

export const promptQueue = PromptQueue(answerRepositoryInMemory())(recurringQuestionRepositoryInMemory())
