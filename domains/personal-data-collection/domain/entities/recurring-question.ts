import cuid from 'cuid'

export default interface RecurringQuestion {
  id: string
  order: number
  question: string
  phases: {
    timestamp: Date
    utcOffsetInMinutes: number
  }[]
}

const createRecurringQuestion = ({
  id = cuid(),
  question = 'N/A',
  order = 999999,
  phases = [{ timestamp: new Date(), utcOffsetInMinutes: 0 }],
}): RecurringQuestion => ({
  id,
  order,
  question,
  phases,
})

export { createRecurringQuestion }
