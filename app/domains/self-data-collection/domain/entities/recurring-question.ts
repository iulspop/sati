import cuid from 'cuid'

export default interface RecurringQuestion {
  id: string
  order: number
  question: string
  phase: {
    timestamp: Date
    utcOffsetInMinutes: number
  }
}

const createRecurringQuestion = ({
  id = cuid(),
  question = 'N/A',
  order = 999999,
  phase = { timestamp: new Date(), utcOffsetInMinutes: 0 },
}): RecurringQuestion => ({
  id,
  order,
  question,
  phase,
})

export { createRecurringQuestion }
