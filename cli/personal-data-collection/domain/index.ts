import { PromptQueue } from './usecases/prompt-queue'
import recurringQuestionRepositoryFileSystem from '../infrastructure/recurring-question-repository-file-system'
import answerRepositoryFileSystem from '../infrastructure/answer-repository-file-system'

export const promptQueue = PromptQueue(recurringQuestionRepositoryFileSystem())(answerRepositoryFileSystem())
