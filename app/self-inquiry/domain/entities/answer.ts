import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

export const AnswerSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  response: z.boolean(),
  timestamp: z.string().transform(str => new Date(str)),
})

export type Answer = z.infer<typeof AnswerSchema>

export const answerFactory = ({ id = createId(), questionId = 'N/A', response = false, timestamp = new Date() }): Answer => ({
  id,
  questionId,
  response,
  timestamp,
})
