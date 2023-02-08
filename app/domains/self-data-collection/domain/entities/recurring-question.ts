import { createId } from '@paralleldrive/cuid2'

export interface RecurringQuestion {
  id: string
  order: number
  question: string
  phase: {
    timestamp: Date
    utcOffsetInMinutes: number
  }
}

export const recurringQuestionFactory = ({
  id = createId(),
  question = 'N/A',
  order = 999999,
  phase = { timestamp: new Date(), utcOffsetInMinutes: 0 },
}): RecurringQuestion => ({
  id,
  order,
  question,
  phase,
})
