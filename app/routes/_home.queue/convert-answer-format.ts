import type { Answer } from '~/self-data-collection/domain/entities/answer'
import type { PromptCardComponentFormEntries } from './prompt-card-component'

export const convertAnswerFormat = (answer: PromptCardComponentFormEntries): Partial<Answer> => ({
  questionId: answer.questionId,
  response: answer.response === 'Yes',
  timestamp: new Date(answer.timestamp),
})
