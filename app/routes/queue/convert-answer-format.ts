import { Answer } from '~/domains/self-data-collection/domain/entities/answer'
import { PromptCardComponentFormEntries } from './prompt-card-component'

export const convertAnswerFormat = (answer: PromptCardComponentFormEntries): Partial<Answer> => ({
  questionId: answer.questionId,
  response: answer.response === 'Yes',
  timestamp: new Date(answer.timestamp),
})
