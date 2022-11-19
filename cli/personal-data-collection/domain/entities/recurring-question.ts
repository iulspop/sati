import cuid from 'cuid'

export default interface RecurringQuestion {
  id: string
  question: string
  phases: {
    timestamp: Date
    utcOffsetInMinutes: number
  }[]
}

const createRecurringQuestion = ({
  id = cuid(),
  question = 'N/A',
  phases = [{ timestamp: new Date(), utcOffsetInMinutes: 0 }],
}): RecurringQuestion => ({
  id,
  question,
  phases,
})

export { RecurringQuestion, createRecurringQuestion }
