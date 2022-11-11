import answerRepositoryInMemory from '../persistance/answerRepositoryInMemory'
import recurringQuestionRepositoryInMemory from '../persistance/recurringQuestionRepositoryInMemory'
import { PromptQueue } from './usecases/promptQueue'

export const promptQueue = PromptQueue(answerRepositoryInMemory())(recurringQuestionRepositoryInMemory())
