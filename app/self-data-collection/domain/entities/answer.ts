import { createId } from '@paralleldrive/cuid2'

export interface Answer {
  id: string
  questionId: string
  response: boolean
  timestamp: Date
}

export const answerFactory = ({
  id = createId(),
  questionId = 'N/A',
  response = false,
  timestamp = new Date(),
}): Answer => ({
  id,
  questionId,
  response,
  timestamp,
})
