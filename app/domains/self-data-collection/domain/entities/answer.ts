import cuid from 'cuid'

export interface Answer {
  id: string
  questionId: string
  response: boolean
  timestamp: Date
}

export const answerFactory = ({
  id = cuid(),
  questionId = 'N/A',
  response = false,
  timestamp = new Date(),
}): Answer => ({
  id,
  questionId,
  response,
  timestamp,
})
