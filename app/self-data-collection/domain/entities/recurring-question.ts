import { createId } from '@paralleldrive/cuid2'

export interface RecurringQuestion {
  id: string
  userId: string
  order: number
  question: string
  phase: {
    timestamp: Date
    utcOffsetInMinutes: number
  }
}

// All properties are required except id and order which are optional
export type CreateRecurringQuestionCommand = Omit<RecurringQuestion, 'id' | 'order'> &
  Partial<Pick<RecurringQuestion, 'id' | 'order'>>

export const recurringQuestionFactory = ({
  id = createId(),
  userId,
  order = 999_999,
  question,
  phase,
}): RecurringQuestion => ({
  id,
  userId,
  order,
  question,
  phase,
})
