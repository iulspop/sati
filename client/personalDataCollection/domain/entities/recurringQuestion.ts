import cuid from 'cuid'

export default interface RecurringQuestion {
  id: string
  question: string
  startDate: Date
}

const createRecurringQuestion = ({ id = cuid(), question = 'N/A', startDate = new Date() }): RecurringQuestion => ({
  id,
  question,
  startDate,
})

export { RecurringQuestion, createRecurringQuestion }
