import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

export const RecurringQuestionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  order: z.number(),
  text: z.string(),
  timestamp: z.string().transform(str => new Date(str)),
  utcOffsetInMinutes: z.number(),
})

export type RecurringQuestion = z.infer<typeof RecurringQuestionSchema>

export type CreateRecurringQuestionCommand = Omit<RecurringQuestion, 'id' | 'order'> & Partial<Pick<RecurringQuestion, 'id' | 'order'>>

export const recurringQuestionFactory = ({
  id = createId(),
  userId = 'x',
  order = 999_999,
  text = 'x',
  timestamp = new Date(),
  utcOffsetInMinutes = 0,
}): RecurringQuestion => ({
  id,
  userId,
  order,
  text,
  timestamp,
  utcOffsetInMinutes,
})
